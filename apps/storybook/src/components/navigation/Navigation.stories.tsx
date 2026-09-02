import {
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	Header,
	HeaderActions,
	HeaderBrand,
	HeaderNav,
	HeaderRail,
	HeaderStatus,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIcon,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuPopup,
	NavigationMenuPortal,
	NavigationMenuPositioner,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	Pagination,
	PaginationButton,
	PaginationEllipsis,
	PaginationItem,
	PaginationList,
	PaginationNext,
	PaginationPrevious,
	Toolbar,
	ToolbarButton,
	ToolbarSeparator
} from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/導覽/導覽元件",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeaderPattern: Story = {
	name: "頁首",
	render: () => (
		<Header>
			<HeaderRail>
				<HeaderBrand href="#">Linyao Design System</HeaderBrand>
				<HeaderNav>
					<a href="#guides">指南</a>
					<a href="#components">元件</a>
					<a href="#resources">資源</a>
				</HeaderNav>
				<HeaderActions>
					<HeaderStatus>
						<Badge size="sm" variant="success">
							所有服務正常
						</Badge>
					</HeaderStatus>
					<Button size="sm">開始使用</Button>
				</HeaderActions>
			</HeaderRail>
		</Header>
	)
};

export const BreadcrumbAndPagination: Story = {
	name: "麵包屑與分頁",
	render: () => (
		<div className="lyds-story-stack">
			<Breadcrumb label="文件位置">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#components">元件</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbLink href="#inputs">輸入</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>文字欄位</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Pagination label="搜尋結果頁面">
				<PaginationList>
					<PaginationItem>
						<PaginationPrevious href="#previous" disabled aria-label="上一頁" />
					</PaginationItem>
					<PaginationItem>
						<PaginationButton>1</PaginationButton>
					</PaginationItem>
					<PaginationItem>
						<PaginationButton current>2</PaginationButton>
					</PaginationItem>
					<PaginationItem>
						<PaginationButton>3</PaginationButton>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis aria-label="更多頁面" />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#next" aria-label="下一頁" />
					</PaginationItem>
				</PaginationList>
			</Pagination>
		</div>
	)
};

export const ApplicationNavigation: Story = {
	name: "應用程式導覽",
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem value="products">
					<NavigationMenuTrigger>
						產品 <NavigationMenuIcon />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink href="#platform">平台</NavigationMenuLink>
						<NavigationMenuLink href="#mobile">行動應用程式</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem value="resources">
					<NavigationMenuTrigger>
						資源 <NavigationMenuIcon />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink href="#guides">指南</NavigationMenuLink>
						<NavigationMenuLink href="#support">支援</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
			<NavigationMenuPortal>
				<NavigationMenuPositioner>
					<NavigationMenuPopup>
						<NavigationMenuViewport />
					</NavigationMenuPopup>
				</NavigationMenuPositioner>
			</NavigationMenuPortal>
		</NavigationMenu>
	)
};

export const ToolbarRovingFocus: Story = {
	name: "工具列鍵盤操作",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Toolbar aria-label="編輯工具">
				<ToolbarButton>復原</ToolbarButton>
				<ToolbarButton>重做</ToolbarButton>
				<ToolbarSeparator />
				<ToolbarButton disabled>發布</ToolbarButton>
			</Toolbar>
			<p className="lyds-story-note">按 Tab 進入工具列，再使用方向鍵移動。</p>
		</div>
	)
};
