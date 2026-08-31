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
				<span className="lyds-story-readout">LY / DS-01</span>
				<HeaderStatus>
					<Badge size="sm" variant="success">
						Network nominal
					</Badge>
				</HeaderStatus>
			</HeaderRail>
			<HeaderBrand href="#">LYDS Control</HeaderBrand>
			<HeaderNav>
				<a href="#systems">Systems</a>
				<a href="#telemetry">Telemetry</a>
				<a href="#records">Records</a>
			</HeaderNav>
			<HeaderActions>
				<Button size="sm">New panel</Button>
			</HeaderActions>
		</Header>
	)
};

export const BreadcrumbAndPagination: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<Breadcrumb label="Equipment location">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#plant">Plant 04</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbLink href="#rack">Rack 12</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>Thermal relay</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Pagination label="Event log pages">
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
				<NavigationMenuItem value="systems">
					<NavigationMenuTrigger>
						Systems <NavigationMenuIcon />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink href="#power">Power channels</NavigationMenuLink>
						<NavigationMenuLink href="#thermal">Thermal relays</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem value="records">
					<NavigationMenuTrigger>
						Records <NavigationMenuIcon />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink href="#events">Event log</NavigationMenuLink>
						<NavigationMenuLink href="#service">Service history</NavigationMenuLink>
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
			<Toolbar aria-label="Diagram controls">
				<ToolbarButton>Move</ToolbarButton>
				<ToolbarButton>Rotate</ToolbarButton>
				<ToolbarSeparator />
				<ToolbarButton disabled>Lock</ToolbarButton>
			</Toolbar>
			<p className="lyds-story-note">Tab into the toolbar once, then use arrow keys to move through enabled controls.</p>
		</div>
	)
};
