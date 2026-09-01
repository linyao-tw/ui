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
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Navigation/Navigation Primitives",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeaderPattern: Story = {
	render: () => (
		<Header>
			<HeaderRail>
				<HeaderBrand href="#">LYDS</HeaderBrand>
				<HeaderNav>
					<a href="#guides">Guides</a>
					<a href="#components">Components</a>
					<a href="#resources">Resources</a>
				</HeaderNav>
				<HeaderActions>
					<HeaderStatus>
						<Badge size="sm" variant="success">
							All services available
						</Badge>
					</HeaderStatus>
					<Button size="sm">Get started</Button>
				</HeaderActions>
			</HeaderRail>
		</Header>
	)
};

export const BreadcrumbAndPagination: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<Breadcrumb label="Documentation location">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#components">Components</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbLink href="#inputs">Inputs</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>Text field</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Pagination label="Search result pages">
				<PaginationList>
					<PaginationItem>
						<PaginationPrevious href="#previous" disabled aria-label="Previous page" />
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
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#next" aria-label="Next page" />
					</PaginationItem>
				</PaginationList>
			</Pagination>
		</div>
	)
};

export const ApplicationNavigation: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem value="products">
					<NavigationMenuTrigger>
						Products <NavigationMenuIcon />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink href="#platform">Platform</NavigationMenuLink>
						<NavigationMenuLink href="#mobile">Mobile applications</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem value="resources">
					<NavigationMenuTrigger>
						Resources <NavigationMenuIcon />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink href="#guides">Guides</NavigationMenuLink>
						<NavigationMenuLink href="#support">Support</NavigationMenuLink>
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
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Toolbar aria-label="Editor controls">
				<ToolbarButton>Undo</ToolbarButton>
				<ToolbarButton>Redo</ToolbarButton>
				<ToolbarSeparator />
				<ToolbarButton disabled>Publish</ToolbarButton>
			</Toolbar>
			<p className="lyds-story-note">Tab into the toolbar once, then use arrow keys to move through enabled controls.</p>
		</div>
	)
};
