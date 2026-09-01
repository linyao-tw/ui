#!/bin/sh
set -eu

usage() {
	cat <<'EOF'
用法：install.sh [--target-root DIRECTORY] [--apply]

安全安裝 lyds-ui Skill。預設只預覽，不會寫入。未指定 --target-root 時，
若已設定 CODEX_HOME，目標是 $CODEX_HOME/skills；否則使用
$HOME/.codex/skills。安裝程式不會覆寫既有 Skill。
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
				echo "錯誤：--target-root 必須指定目錄" >&2
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
			echo "錯誤：無法辨識的參數：$1" >&2
			usage >&2
			exit 2
			;;
	esac
done

[ -f "${skill_directory}/SKILL.md" ] || {
	echo "錯誤：${skill_directory} 缺少 SKILL.md" >&2
	exit 1
}
[ -n "$target_root" ] && [ "$target_root" != "/" ] || {
	echo "錯誤：拒絕使用不安全的目標根目錄：${target_root}" >&2
	exit 1
}

destination="${target_root}/lyds-ui"
if [ -e "$destination" ] || [ -L "$destination" ]; then
	echo "錯誤：目標已存在，不會覆寫：${destination}" >&2
	exit 1
fi

if [ "$apply" != true ]; then
	echo "預覽：將把 ${skill_directory} 複製到 ${destination}"
	echo "確認後加上 --apply 重新執行以完成安裝"
	exit 0
fi

mkdir -p -- "$target_root"
cp -R -- "$skill_directory" "$destination"
echo "已將 lyds-ui Skill 安裝至 ${destination}"
