# Pawn IDE Design Specification

## Design Philosophy: Minimalist Developer Tool

**Theme Name:** Minimalist Developer Tool  
**Design Movement:** Bauhaus-inspired minimalism with developer-focused pragmatism  
**Core Principles:**
1. **Clarity over decoration** - Every UI element serves a function; no visual noise
2. **Dark-first accessibility** - Reduced eye strain during long coding sessions
3. **Green accent for action** - Consistent visual feedback for interactive elements
4. **Efficient space utilization** - Maximize editor real estate, minimize chrome

**Color Philosophy:**
- **Background:** Deep charcoal (`#0f1419`) - reduces eye fatigue, professional appearance
- **Text/Foreground:** Light gray (`#e4e6eb`) - high contrast for readability
- **Accent (Primary):** Vibrant green (`#10b981`) - SA-MP themed, action-oriented, stands out against dark bg
- **Secondary:** Muted gray (`#6b7280`) - subtle UI elements, borders, inactive states
- **Highlight:** Bright green (`#34d399`) - hover states, focus indicators, active selections

**Layout Paradigm:**
- **Header:** Fixed top bar with project name, action buttons (Open Folder, Settings)
- **Sidebar:** Fixed left panel showing file tree, searchable, collapsible
- **Editor:** Main content area, flexible width, responsive
- **Status Bar:** Fixed bottom bar with file info, cursor position, encoding

**Signature Elements:**
1. **Green accent line** - Left border on active file in tree, underline on active tab
2. **Minimal rounded corners** - Subtle 4px radius on interactive elements only
3. **Monospace typography** - Code-centric, professional appearance

**Interaction Philosophy:**
- Instant feedback on all interactions (no delays)
- Hover states with subtle color shifts
- Tab-based multi-file navigation
- Keyboard shortcuts as primary interaction method

**Animation:**
- Minimal, purposeful motion only
- Tab transitions: 150ms ease-out
- Hover effects: 100ms ease-out
- No entrance animations on page load

**Typography System:**
- **Display/Headers:** System font stack (SF Pro, Segoe UI, sans-serif), weight 600
- **Body/UI:** System font stack, weight 400
- **Code:** Monospace (Monaco built-in), weight 400

**Brand Essence:**
- **One-liner:** A lightweight, distraction-free code editor for SA-MP gamemode development
- **Personality:** Professional, efficient, developer-focused

**Brand Voice:**
- Straightforward, no marketing speak
- Example lines:
  - "Open Folder to get started"
  - "Ctrl+S to save"

**Wordmark & Logo:**
- Simple text logo: "Pawn IDE" in monospace, green accent on "IDE"
- No decorative icon needed

**Signature Brand Color:**
- Vibrant Green (`#10b981`) - unmistakably SA-MP/developer-focused

## Implementation Notes

- Mobile-friendly: Stack sidebar below editor on small screens
- Accessibility: Full keyboard navigation, high contrast ratios
- Performance: Lazy-load file tree, efficient re-renders
- No external UI libraries beyond Monaco Editor - vanilla CSS for simplicity
