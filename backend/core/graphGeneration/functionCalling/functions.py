GRAPH_GENERATION_FUNCTION = {
      "type": "function",
      "name": "create_learning_graph",
      "description": "Transform German text into an advanced learning graph with multiple relationship types and visual modifiers.",
      "parameters": {
        "type": "object",
        "required": [
          "topic",
          "nodes",
          "edges"
        ],
        "properties": {
          "topic": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "description": "Main theme/title of the graph"
              },
              "translation": {
                "type": "string",
                "description": "Translation of the title"
              }
            },
            "required": [
              "description",
              "translation"
            ],
            "additionalProperties": False
          },
          "nodes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Unique identifier for the node"
                },
                "main_label": {
                  "type": "string",
                  "description": "Primary node text in German"
                },
                "display_type": {
                  "type": "string",
                  "enum": [
                    "image",
                    "text",
                    "both"
                  ],
                  "description": "Type of content displayed for the node"
                },
                "crossed": {
                  "type": "boolean",
                  "description": "Indicates if the node is crossed out"
                },
                "subpoints": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "text": {
                        "type": "string",
                        "description": "Subpoint text in German"
                      },
                      "translation": {
                        "type": "string",
                        "description": "Translation of the subpoint text"
                      },
                      "crossed": {
                        "type": "boolean",
                        "description": "Indicates if the subpoint is crossed out"
                      }
                    },
                    "required": [
                      "text",
                      "translation",
                      "crossed"
                    ],
                    "additionalProperties": False
                  }
                },
                "translation": {
                  "type": "string",
                  "description": "Translation of the main label"
                },
                "image_description": {
                  "type": "string",
                  "description": "Short description of an icon representing the node"
                }
              },
              "required": [
                "id",
                "main_label",
                "display_type",
                "crossed",
                "subpoints",
                "translation",
                "image_description"
              ],
              "additionalProperties": False
            }
          },
          "edges": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "source": {
                  "type": "string",
                  "description": "Source node ID"
                },
                "target": {
                  "type": "string",
                  "description": "Target node ID"
                },
                "label": {
                  "type": "string",
                  "description": "Label for the edge. None if not needed"
                },
                "translation": {
                  "type": "string",
                  "description": "Translation of the label for the edge. None if not needed"
                },
                "arrow_type": {
                  "type": "string",
                  "enum": [
                    "normal",
                    "dashed",
                    "dotted",
                    "plus"
                  ],
                  "description": "Type of arrow for the edge"
                }
              },
              "required": [
                "source",
                "target",
                "label",
                "arrow_type",
                "translation"
              ],
              "additionalProperties": False
            }
          }
        },
        "additionalProperties": False
      },
      "strict": True
    }