import { Avatar, Badge, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle, IconButton, Link, ListCell, SectionHeading, Separator } from "@lyds/ui";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import "../story-layout.css";

const buttonVariants = ["primary", "secondary", "quiet", "danger"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;
const linkVariants = ["default", "accent", "subtle"] as const;
const linkSizes = ["sm", "md", "lg"] as const;
const badgeVariants = ["neutral", "accent", "success", "warning", "danger"] as const;
const badgeSizes = ["sm", "md"] as const;
const avatarSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const cardVariants = ["material", "elevated", "inset", "outline", "cloud"] as const;
const cardSizes = ["sm", "md", "lg"] as const;
const headingSizes = ["sm", "md", "lg"] as const;
const buttonVariantLabels = {
	primary: "主要",
	secondary: "次要",
	quiet: "低調",
	danger: "危險"
} as const;
const linkVariantLabels = { default: "預設", accent: "強調", subtle: "次要" } as const;
const sizeLabels = { xs: "特小", sm: "小", md: "中", lg: "大", xl: "特大" } as const;
const badgeVariantLabels = {
	neutral: "一般",
	accent: "強調",
	success: "成功",
	warning: "警告",
	danger: "錯誤"
} as const;
const cardVariantLabels = {
	material: "實色",
	elevated: "浮起",
	inset: "內嵌",
	outline: "外框",
	cloud: "無邊界"
} as const;

const meta = {
	title: "元件/基礎/狀態總覽",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface StateSectionProps {
	id: string;
	title: string;
	children: ReactNode;
}

function StateSection({ id, title, children }: StateSectionProps) {
	return (
		<section aria-labelledby={id} className="lyds-story-panel">
			<h2 id={id} className="lyds-story-panel__heading">
				{title}
			</h2>
			{children}
		</section>
	);
}

function MatrixCard({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Card size="sm" variant="outline">
			<CardHeader>
				<CardTitle>{label}</CardTitle>
			</CardHeader>
			<CardBody>{children}</CardBody>
		</Card>
	);
}

export const IconButtonStates: Story = {
	name: "圖示按鈕",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="icon-button-variants" title="樣式">
				<div className="lyds-story-row">
					{buttonVariants.map(variant => (
						<IconButton key={variant} aria-label={`${buttonVariantLabels[variant]}通知操作`} variant={variant}>
							<BellIcon weight="bold" />
						</IconButton>
					))}
				</div>
			</StateSection>
			<StateSection id="icon-button-sizes" title="尺寸">
				<div className="lyds-story-row">
					{buttonSizes.map(size => (
						<IconButton key={size} aria-label={`新增項目，${sizeLabels[size]}型`} size={size} variant="secondary">
							<PlusIcon weight="bold" />
						</IconButton>
					))}
				</div>
			</StateSection>
			<StateSection id="icon-button-availability" title="載入與停用">
				<div className="lyds-story-row">
					<IconButton aria-label="儲存項目" loading>
						<FloppyDiskIcon weight="bold" />
					</IconButton>
					<IconButton aria-label="刪除項目" disabled variant="danger">
						<TrashIcon weight="bold" />
					</IconButton>
				</div>
			</StateSection>
		</div>
	)
};

export const LinkStates: Story = {
	name: "連結",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="link-variants" title="樣式">
				<div className="lyds-story-row">
					{linkVariants.map(variant => (
						<Link key={variant} href={`#${variant}`} variant={variant}>
							{linkVariantLabels[variant]}連結
						</Link>
					))}
				</div>
			</StateSection>
			<StateSection id="link-sizes" title="尺寸">
				<div className="lyds-story-row">
					{linkSizes.map(size => (
						<Link key={size} href={`#${size}`} size={size}>
							{sizeLabels[size]}型文件連結
						</Link>
					))}
				</div>
			</StateSection>
			<StateSection id="link-behavior" title="停用、外部連結與長文字">
				<div className="lyds-story-stack lyds-story-stack--narrow">
					<Link disabled href="#disabled">
						文件目前無法使用
					</Link>
					<Link external href="https://example.com" rel="noreferrer" target="_blank" variant="accent">
						外部參考資料（另開新分頁）
					</Link>
					<Link href="#long-link">查看工作區存取、保留期限、協作與通知設定</Link>
				</div>
			</StateSection>
		</div>
	)
};

export const BadgeStates: Story = {
	name: "徽章",
	render: () => (
		<div className="lyds-story-stack">
			{badgeSizes.map(size => (
				<StateSection key={size} id={`badge-${size}`} title={`${sizeLabels[size]}型樣式`}>
					<div className="lyds-story-row">
						{badgeVariants.map(variant => (
							<Badge key={variant} size={size} variant={variant}>
								{badgeVariantLabels[variant]}
							</Badge>
						))}
					</div>
				</StateSection>
			))}
			<StateSection id="badge-long" title="長文字狀態">
				<Badge variant="warning">等待工作區管理員核准</Badge>
			</StateSection>
		</div>
	)
};

export const AvatarStates: Story = {
	name: "頭像",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="avatar-sizes" title="尺寸">
				<div className="lyds-story-row">
					{avatarSizes.map(size => (
						<Avatar key={size} alt={`${sizeLabels[size]}型團隊頭像`} fallback={sizeLabels[size]} size={size} />
					))}
				</div>
			</StateSection>
			<StateSection id="avatar-variants" title="一般與強調樣式">
				<div className="lyds-story-row">
					<Avatar alt="一般帳號" fallback="一般" />
					<Avatar alt="強調帳號" fallback="強調" variant="accent" />
				</div>
			</StateSection>
			<StateSection id="avatar-statuses" title="狀態">
				<div className="lyds-story-row">
					<Avatar alt="上線帳號" fallback="上線" status="online" statusLabel="上線" />
					<Avatar alt="暫離帳號" fallback="暫離" status="away" statusLabel="暫離" />
					<Avatar alt="忙碌帳號" fallback="忙碌" status="busy" statusLabel="忙碌" />
					<Avatar alt="離線帳號" fallback="離線" status="offline" statusLabel="離線" />
				</div>
			</StateSection>
		</div>
	)
};

export const SeparatorStates: Story = {
	name: "分隔線",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="separator-horizontal" title="水平樣式與間距">
				<div className="lyds-story-stack lyds-story-stack--narrow">
					<span className="lyds-story-readout">實線 · 無間距</span>
					<Separator spacing="none" />
					<span className="lyds-story-readout">點線 · 小間距</span>
					<Separator spacing="sm" variant="technical" />
					<span className="lyds-story-readout">實線 · 中間距</span>
					<Separator spacing="md" />
					<span className="lyds-story-readout">點線 · 大間距</span>
					<Separator spacing="lg" variant="technical" />
				</div>
			</StateSection>
			<StateSection id="separator-vertical" title="垂直樣式">
				<div className="lyds-story-row">
					<span className="lyds-story-readout">主要資訊</span>
					<Separator orientation="vertical" spacing="sm" />
					<span className="lyds-story-readout">次要資訊</span>
					<Separator orientation="vertical" spacing="sm" variant="technical" />
					<span className="lyds-story-readout">補充資訊</span>
				</div>
			</StateSection>
		</div>
	)
};

export const CardStates: Story = {
	name: "卡片",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="card-variants" title="樣式">
				<div className="lyds-story-grid">
					{cardVariants.map(variant => (
						<Card key={variant} variant={variant}>
							<CardHeader>
								<Badge size="sm" variant={variant === "inset" ? "warning" : "neutral"}>
									{cardVariantLabels[variant]}
								</Badge>
								<CardTitle>工作區摘要</CardTitle>
								<CardDescription>{cardVariantLabels[variant]}卡片的內容層級。</CardDescription>
							</CardHeader>
							<CardBody className="lyds-story-readout">12 位成員 · 更新於 14:32</CardBody>
						</Card>
					))}
				</div>
			</StateSection>
			<StateSection id="card-sizes" title="尺寸">
				<div className="lyds-story-grid">
					{cardSizes.map(size => (
						<Card key={size} size={size} variant="outline">
							<CardHeader>
								<CardTitle>{sizeLabels[size]}型卡片</CardTitle>
								<CardDescription>此尺寸的間距與內容層級。</CardDescription>
							</CardHeader>
						</Card>
					))}
				</div>
			</StateSection>
		</div>
	)
};

export const SectionHeadingStates: Story = {
	name: "區段標題",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			{headingSizes.map((size, index) => (
				<section key={size} aria-label={`${sizeLabels[size]}型區段標題範例`}>
					<SectionHeading
						action={<Badge variant={index === 2 ? "warning" : "success"}>{index === 2 ? "待確認" : "目前"}</Badge>}
						annotation={`${index + 1} 組`}
						description="區段的補充說明。"
						level={(index + 2) as 2 | 3 | 4}
						size={size}
					>
						{sizeLabels[size]}型區段標題
					</SectionHeading>
				</section>
			))}
			<section aria-label="長文字區段標題範例">
				<SectionHeading annotation="長文字" description="窄版面中的長標題會換行，操作狀態仍保持可見。" action={<Badge variant="accent">5 項更新</Badge>}>
					工作區權限、通知傳送、文件保留與協作設定
				</SectionHeading>
			</section>
		</div>
	)
};

export const ListCellStates: Story = {
	name: "清單項目",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<ListCell
				leading={<Avatar alt="設計團隊" fallback="設計" status="online" statusLabel="上線" />}
				title="預設清單項目"
				description="靜態補充資訊"
				metadata="今天"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
			<ListCell
				action={{ href: "#workspace", "aria-label": "開啟目前工作區" }}
				leading={<Avatar alt="目前工作區" fallback="目前" variant="accent" />}
				metadata="目前"
				selected
				selectionSemantics="page"
				title="已選取的連結項目"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
			<ListCell action={{ "aria-label": "查看應用程式設定" }} description="可使用鍵盤操作的按鈕項目" metadata="2 項更新" size="sm" title="小型按鈕項目" />
			<ListCell description="使用內嵌樣式的大型項目" metadata="昨天" size="lg" title="大型內嵌項目" variant="inset" />
			<ListCell disabled description="目前帳號無法使用" metadata="已停用" title="停用項目" />
			<ListCell
				description="窄版面中的長說明會截斷，不會與中繼資料或尾端操作重疊。"
				metadata="12 分鐘前更新"
				title="用於確認響應式版面的長名稱工作區"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
		</div>
	)
};

export const NarrowLongContent: Story = {
	name: "窄版長文字",
	parameters: { viewport: { defaultViewport: "mobile1" } },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="窄版面" description="標題與狀態會在窄版面中保持可讀。" action={<Badge variant="warning">待確認</Badge>}>
				工作區存取與文件保留設定
			</SectionHeading>
			<Card variant="material">
				<CardHeader>
					<CardTitle>確認執行工作區作業</CardTitle>
					<CardDescription>所有文件處理完成前，編輯功能將暫時無法使用。</CardDescription>
				</CardHeader>
				<CardBody className="lyds-story-readout">預計時間：18 分鐘</CardBody>
				<CardFooter className="lyds-story-row">
					<Button endIcon={<ArrowRightIcon weight="bold" />}>開始執行</Button>
					<Link href="#settings" variant="subtle">
						繼續前查看設定
					</Link>
				</CardFooter>
			</Card>
			<ListCell leading={<Avatar alt="研究與策略工作區" fallback="研究" />} metadata="今天更新" title="研究與策略工作區" trailing={<CaretRightIcon aria-hidden weight="bold" />} />
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="深色主題" action={<Badge variant="success">正常</Badge>}>
				基礎元件
			</SectionHeading>
			<MatrixCard label="操作與狀態">
				<div className="lyds-story-row">
					<IconButton aria-label="新增通知" variant="secondary">
						<PlusIcon weight="bold" />
					</IconButton>
					<Link href="#dark-link" variant="accent">
						開啟詳細資料
					</Link>
					<Badge variant="warning">注意</Badge>
					<Avatar alt="忙碌帳號" fallback="忙碌" status="busy" statusLabel="忙碌" variant="accent" />
				</div>
			</MatrixCard>
			<Separator variant="technical" />
			<Card variant="inset">
				<CardHeader>
					<CardTitle>深色實色卡片</CardTitle>
					<CardDescription>深色主題中的卡片內容層級。</CardDescription>
				</CardHeader>
			</Card>
			<ListCell description="深色主題中的已選取內容" metadata="目前" selected selectionSemantics="page" title="已選取的深色主題項目" trailing={<CaretRightIcon aria-hidden weight="bold" />} />
		</div>
	)
};
