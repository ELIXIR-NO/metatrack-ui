import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface TreeNode {
	name: string;
	children?: TreeNode[];
}

interface ProjectTreeProps {
	data: TreeNode;
	width?: number;
}

export function ProjectTree({ data, width = 800 }: ProjectTreeProps) {
	const ref = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!data || !ref.current) return;

		d3.select(ref.current).selectAll("*").remove();

		const root = d3.hierarchy(data);
		const dx = 20;
		const dy = width / (root.height + 1);
		const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
		root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
		tree(root);

		let x0 = Infinity;
		let x1 = -x0;
		root.each((d) => {
			const x = d.x ?? 0;
			if (x > x1) x1 = x;
			if (x < x0) x0 = x;
		});

		const height = x1 - x0 + dx * 2;
		const svg = d3
			.select(ref.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [-dy / 2, x0 - dx, width, height])
			.attr("style", "max-width: 100%; height: auto; font: 14px sans-serif;");

		const linkGenerator = d3
			.linkHorizontal<
				d3.HierarchyPointLink<TreeNode>,
				d3.HierarchyPointNode<TreeNode>
			>()
			.x((d) => d.y)
			.y((d) => d.x);

		svg
			.append("g")
			.attr("fill", "none")
			.attr("stroke", "#555")
			.attr("stroke-opacity", 0.4)
			.attr("stroke-width", 1.5)
			.selectAll("path")
			.data(root.links() as d3.HierarchyPointLink<TreeNode>[])
			.join("path")
			.attr("d", (d) => linkGenerator(d));

		const node = svg
			.append("g")
			.attr("stroke-linejoin", "round")
			.attr("stroke-width", 3)
			.selectAll("g")
			.data(root.descendants())
			.join("g")
			.attr("transform", (d) => `translate(${d.y},${d.x})`);

		node
			.append("circle")
			.attr("fill", (d) => (d.children ? "#555" : "#999"))
			.attr("r", 4);

		node
			.append("text")
			.attr("dy", "0.31em")
			.attr("x", (d) => (d.children ? -6 : 6))
			.attr("text-anchor", (d) => (d.children ? "end" : "start"))
			.text((d) => d.data.name)
			.attr("stroke", "white")
			.attr("paint-order", "stroke");
	}, [data, width]);

	return <svg ref={ref}></svg>;
}
