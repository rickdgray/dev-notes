---
title: Advance Wars
lastmod: 2023-05-27T22:09:40-05:00
---
# Advance Wars
## Advance Wars Campaign Unlock Flowchart

<br>

```mermaid
flowchart TD

1[1-6]
7A[7A-8A]
7M[7M-10M]
13F[13]
14F[14]
15[15-17]
18[18-21]
22[22-24]
22A[22-24]
22S[22-24]
A[Unlock Grit]
B[Unlock Sonja]
C[Unlock Drake]
D[Unlock Eagle]
E[Unlock Kanbei]
F[Unlock Nell]
G[Unlock Sturm]

X[Unlock all COs]
Z[Advance Campaign Clear]

1 -->|Andy Branch| 7A
1 -->|Max Branch| 7M
7A --> 9A
9A -->|HQ Cap| 11
9A -->|Rout| 10A
7M --> A
10A --> 11
A --> 11
11 --> 12
12 --> 13
12 -->|Clear in 8 days or less| 13F
13 --> 14
13F --> 14
13F -->|Clear in 10 days or less| 14F
14 --> 18
14F --> 18
14F -->|Clear in 12 days or less| 15
15 --> B
B --> 18
18 -->|Only use Andy| 22A
18 -->|Only use Sami| 22S
18 --> 22
22A --> C
22S --> 25
25 --> D
22 & C & D --> E

X --> G
G & Z --> F

style A stroke:#69a2ff,stroke-width:3px
style B stroke:#69a2ff,stroke-width:3px
style C stroke:#69a2ff,stroke-width:3px
style D stroke:#69a2ff,stroke-width:3px
style E stroke:#69a2ff,stroke-width:3px
style F stroke:#69a2ff,stroke-width:3px
style G stroke:#69a2ff,stroke-width:3px

style 10A stroke:#ff696e,stroke-width:3px
style 15 stroke:#ff696e,stroke-width:3px
style 25 stroke:#ff696e,stroke-width:3px
```