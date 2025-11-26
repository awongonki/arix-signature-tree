# 🎄 Arix Signature Interactive Tree

> **A high-fidelity 3D cinematic web experience featuring instanced particle physics and morphing geometry.**
## 🟢 [CLICK HERE TO PLAY LIVE DEMO](https://z386v6-3000.csb.app/)
*(Experience the 3D simulation in your browser)*
<img width="1761" height="1797" alt="image" src="https://github.com/user-attachments/assets/26ec0b4d-bc05-4152-82e5-1e3644de914a" />


<!-- BUTTONS -->
[![Open in CodeSandbox](https://img.shields.io/badge/Play_in_CodeSandbox-black?style=for-the-badge&logo=codesandbox&logoColor=white)](https://codesandbox.io/p/github/awongonki/arix-signature-tree/main)
[![View on GitHub](https://img.shields.io/badge/GitHub-Repository-gray?style=for-the-badge&logo=github)](https://github.com/awongonki/arix-signature-tree)



## 🎨 About The Project

This project represents my **first exploration into High-End 3D User Experience (UX)**. The goal was to translate the feeling of a "New York Luxury Christmas" into a web browser—moving away from static web design into an immersive, cinematic environment.

The visual language focuses on **Emerald & Gold**, utilizing physically based rendering (PBR) materials to create glass-like refraction and metallic shine.

### 🤖 AI-Collaborative Design
This architecture was co-developed with **Google Gemini 3**. 
*   **Role of AI:** Algorithm generation (Phyllotaxis spirals), math optimization for instanced meshes, and React 19 boilerplate.
*   **Role of Human Engineer:** Art direction, lighting composition, material tuning, and interaction logic.

---

## ⚙️ Core Technology: The Dual Position System (DPS)

To achieve the fluid transition between chaos and order, the engine uses a custom **Dual Position System**. Every single element (Leaf/Ornament) holds two sets of coordinates simultaneously:

1.  **State A: The Scatter Field**
    *   Elements calculate a random position within a `spherical radius`, creating a floating zero-gravity debris field.
    
2.  **State B: The Phyllotaxis Cone**
    *   Elements calculate a target position based on the Golden Angle (~137.5°), forming a perfect spiral cone (the Christmas Tree shape).

**The Transition:**
Instead of deleting and re-creating meshes, the engine uses **Linear Interpolation (Lerp)** inside the render loop (`useFrame`). This creates a magnetic "snap" effect where particles physically travel to their new destination, creating a living, breathing organic structure.

---

## 🛠 Tech Stack

*   **Core:** React 19 (Beta/Experimental)
*   **3D Engine:** Three.js
*   **Renderer:** React Three Fiber (R3F)
*   **Performance:** InstancedMesh (rendering 1500+ objects with a single draw call)
*   **Post-Processing:** Bloom (Unreal Engine style glow) & Vignette

---

*Designed by Arix Interaction Lab // Powered by Gemini 3*
