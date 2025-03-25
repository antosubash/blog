# Mermaid Diagrams Support

This blog now supports Mermaid diagrams! You can create beautiful flowcharts, sequence diagrams, and other diagrams directly in your MDX files.

## Usage

Simply wrap your Mermaid diagram code in a `mermaid` code block:

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

## Supported Diagram Types

Mermaid supports many types of diagrams:

### Flowcharts

```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
```

### Sequence Diagrams

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

### Class Diagrams

```mermaid
classDiagram
    class Animal {
        +String name
        +move()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
```

### Entity Relationship Diagrams

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    CUSTOMER }|..|{ DELIVERY_ADDRESS : uses
```

### State Diagrams

```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

### Gantt Charts

```mermaid
gantt
    title A Gantt Chart
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

### Pie Charts

```mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

## Features

- **Responsive**: Diagrams automatically resize to fit the container
- **Dark Mode Support**: Diagrams adapt to light/dark themes
- **Error Handling**: If a diagram fails to render, an error message is shown with the code
- **Loading States**: Shows a loading spinner while rendering
- **Accessibility**: Proper ARIA labels and semantic HTML

## Configuration

The Mermaid component is configured with the following settings:

- Theme: Default (adapts to light/dark mode)
- Font: Inherits from the page
- Security: Loose (allows all features)
- Responsive: All diagram types use max-width for responsiveness

## Troubleshooting

If your diagram doesn't render:

1. Check the syntax in the [Mermaid Live Editor](https://mermaid.live/)
2. Ensure the code block is properly formatted with `mermaid` language identifier
3. Check the browser console for any JavaScript errors
4. Verify that the diagram code is valid Mermaid syntax

## Examples

You can find examples of Mermaid diagrams in the blog posts. The first example is in the ABP React CMS Module post, which shows a system architecture diagram.
