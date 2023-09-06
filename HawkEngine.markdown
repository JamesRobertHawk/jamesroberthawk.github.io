---
layout: pagewcolumns
title: HawkEngine
permalink: /HawkEngine/
image: /assets/Images/EngineCover.jpg
contenttitle1: "Distributed design"
content1: 
- Micro-service approach to game development, each game component is treated as a separate micro-system. Each service can communicate with other services, in a process, locally across processes or across network.
- Clearly isolate small segments of complex systems to speed up development.
- Reuses small common components to make the larger systems to aid development efficiency.
contentimage1: /assets/Images/HawkEngineStructure.jpg
contenttitle2: "Core tech"
content2: 
- There are a three levels of development distinct levels
content2List:
- Core engine programming written platform agnostically in c++. Responsible for core features, memory management, game loop and interfaces
- Component implementation written in c++. Responsible for component interface implementation to create functionality for things like graphics devices and physics engines.
- Component scripting written in lua. Responsible for utilising components, adding custom game scripting and overall game design.
contentvideo2: https://www.youtube.com/embed/Fwwv9GifkFM
contentlink2: https://jamesroberthawk.github.io/indiedev/update/2021/09/02/vertical-slice-postmortem.html
contenttitle3: "Implicitly Parallel"
content3: 
- Hawk engine is made of components which can cross communicate with each other.
- Components are grouped in computation blocks and while any components can directly communicate to any other, the correct design pattern is to keep communication relative to parent and children of blocks.
- The engine calculates component relationships at load and produces the execution order.
- Updates of unrelated components automatically run asynchronously without input from the designer.
- All synchrony can be turned off to simplify debugging.
contentvideo3: https://www.youtube.com/embed/Fwwv9GifkFM
contentlink3: https://jamesroberthawk.github.io/indiedev/update/2021/09/02/vertical-slice-postmortem.html
contenttitle4: "Separated tooling"
content4: 
- The engine is strictly code development only, however hooks are exposed that can be utilised to offer tooling and gui editors.
- Hawk Engine offers a generic solution for any game type therefore to create a fully featured gui to suit all game genres is unrealistic for a sole developer. However it is possible.
- To create a manageable workflow my title currently under development has been developed with a gui editing tool specifically focused to meet the needs of that games' specific genre.
contentvideo4: https://www.youtube.com/embed/Fwwv9GifkFM
contentlink4: https://jamesroberthawk.github.io/indiedev/update/2021/09/02/vertical-slice-postmortem.html
contenttitle5: "Availability"
content5: 
- Hawk Engine is currently not scheduled for release.
- If you are interested in finding more information about this tech, please visit my general enquires page.
contentvideo5: https://www.youtube.com/embed/Fwwv9GifkFM
contentlink5: https://jamesroberthawk.github.io/indiedev/update/2021/09/02/vertical-slice-postmortem.html

---

# An engine focussed on distributed design and asynchronous patterns
HawkEngine is being designed along side my game project ChaosTheDevil. It is designed to offer a flexible system which can scale as a project grows. HawkEngine contains interfaces aimed at game development, however the core of the engine can be used for any micro-service style application.
