import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface BreadcrumbItemProps {
	label: string;
	href?: string;
}

interface SiteHeaderProps {
	items?: BreadcrumbItemProps[];
}

export function SiteHeader({ items = [] }: SiteHeaderProps) {
	const DefaultItems: BreadcrumbItemProps[] = [
		{ label: "Overview", href: "/dashboard" },
		...items,
	];
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{DefaultItems.map((item, i) => (
							<BreadcrumbItem key={i}>
								{item.href ? (
									<>
										<BreadcrumbLink href={item.href}>
											{item.label}
										</BreadcrumbLink>
										{i < items.length && <BreadcrumbSeparator />}
									</>
								) : (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
