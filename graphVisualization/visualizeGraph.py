import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.patches import ArrowStyle

def visualize_graph(data):
    G = nx.DiGraph()  # Changed from MultiDiGraph to DiGraph

    # Add nodes with enhanced formatting
    for node in data["nodes"]:
        crossed = "~~CROSSED~~ " if node["crossed"] else ""
        label = (
            f"{crossed}{node['main_label']}\n"
            f"({node['translation']})\n"
            f"Type: {node['display_type'].upper()}\n"
            f"Image: {node['image_description'][:30]}..."
        )
        if node["subpoints"]:
            label += "\n\nSubpoints:"
            for sp in node["subpoints"]:
                sp_crossed = "~~CROSSED~~ " if sp.get("crossed", False) else ""
                label += f"\n- {sp_crossed}{sp['text']} ({sp['translation']})"
        G.add_node(node["id"], label=label)

    # Configure edge styles
    edge_style_map = {
        "normal": {"style": "solid", "arrowsize": 20, "arrow_type": "->"},
        "dashed": {"style": "dashed", "arrowsize": 18, "arrow_type": "->"},
        "dotted": {"style": "dotted", "arrowsize": 16, "arrow_type": "->"},
        "plus": {"style": "solid", "arrow_type": "-|>", "arrowsize": 22}
    }

    # Add edges with metadata
    for edge in data["edges"]:
        G.add_edge(edge["source"], edge["target"],
                   label=f"{edge['label']} ({edge['translation']})",
                   **edge_style_map[edge["arrow_type"]])

    # Create layout
    pos = nx.spring_layout(G, k=0.5, seed=42)

    # Draw nodes
    plt.figure(figsize=(20, 15))
    nx.draw_networkx_nodes(
        G, pos,
        node_size=5000,
        node_color="lightyellow",
        edgecolors="black",
        linewidths=2,
        alpha=0.9
    )

    # Draw edges with different styles
    for edge_type in edge_style_map:
        edges = [(u, v) for (u, v, attrs) in G.edges(data=True)
                 if attrs["arrow_type"] == edge_style_map[edge_type].get("arrow_type", "->")]
        nx.draw_networkx_edges(
            G, pos,
            edgelist=edges,
            edge_color="navy",
            style=edge_style_map[edge_type]["style"],
            width=2,
            arrowstyle=edge_style_map[edge_type].get("arrow_type", "-|>"),
            arrowsize=edge_style_map[edge_type]["arrowsize"]
        )

    # Draw labels
    node_labels = nx.get_node_attributes(G, "label")
    nx.draw_networkx_labels(
        G, pos,
        labels=node_labels,
        font_size=10,
        font_family="sans-serif",
        verticalalignment="center",
        bbox=dict(boxstyle="round", facecolor="white", edgecolor="none", alpha=0.8)
    )

    edge_labels = nx.get_edge_attributes(G, "label")
    nx.draw_networkx_edge_labels(
        G, pos,
        edge_labels=edge_labels,
        font_size=9,
        font_color="darkred",
        bbox=dict(boxstyle="round", facecolor="white", edgecolor="none", alpha=0.7)
    )

    # Add title
    title = f"{data['topic']['description']}\n({data['topic']['translation']})"
    plt.title(title, fontsize=14, pad=20)

    plt.axis("off")
    plt.tight_layout()
    plt.savefig("graph.png")
