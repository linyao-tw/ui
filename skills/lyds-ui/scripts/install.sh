#!/bin/sh
set -eu

usage() {
	cat <<'EOF'
Usage: install.sh [--target-root DIRECTORY] [--apply]

Safely install this lyds-ui skill. The default is a dry run. Without
--target-root, the destination root is $CODEX_HOME/skills when CODEX_HOME is
set, otherwise $HOME/.codex/skills. Existing skills are never overwritten.
EOF
}

script_directory=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
skill_directory=$(dirname -- "$script_directory")

if [ -n "${CODEX_HOME:-}" ]; then
	target_root="${CODEX_HOME}/skills"
else
	: "${HOME:?HOME must be set when CODEX_HOME is not set}"
	target_root="${HOME}/.codex/skills"
fi

apply=false
while [ "$#" -gt 0 ]; do
	case "$1" in
		--target-root)
			[ "$#" -ge 2 ] || {
				echo "error: --target-root requires a directory" >&2
				exit 2
			}
			target_root=$2
			shift 2
			;;
		--apply)
			apply=true
			shift
			;;
		-h | --help)
			usage
			exit 0
			;;
		*)
			echo "error: unknown argument: $1" >&2
			usage >&2
			exit 2
			;;
	esac
done

[ -f "${skill_directory}/SKILL.md" ] || {
	echo "error: SKILL.md is missing from ${skill_directory}" >&2
	exit 1
}
[ -n "$target_root" ] && [ "$target_root" != "/" ] || {
	echo "error: refusing unsafe target root: ${target_root}" >&2
	exit 1
}

destination="${target_root}/lyds-ui"
if [ -e "$destination" ] || [ -L "$destination" ]; then
	echo "error: destination already exists; refusing to overwrite: ${destination}" >&2
	exit 1
fi

if [ "$apply" != true ]; then
	echo "dry run: would copy ${skill_directory} to ${destination}"
	echo "rerun with --apply to install"
	exit 0
fi

mkdir -p -- "$target_root"
cp -R -- "$skill_directory" "$destination"
echo "installed lyds-ui skill at ${destination}"
