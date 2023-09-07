---
layout: pagewcolumns
title: HawkEngine
permalink: /HawkEngine/
image: /assets/Images/EngineCover.jpg
contenttitle1: "Distributed design"
content1: 
- Hawk Engine uses a micro-service approach to game development where each game component is treated as a separate micro-system. 
- Each service can communicate with other services in a process, locally, or across network.
- The engine allows you to clearly isolate small segments of complex systems to speed up development.
- Common components used to make the larger systems can be easily reused, aiding development efficiency.
contentimage1: /assets/Images/HawkEngineStructure.jpg
contenttitle2: "Dev role seperation"
content2List:
- Core engine programming written platform agnostically in c++. Responsible for core features, memory management, game loop and interfaces
- Component implementation written in c++. Responsible for component interface implementation to create functionality for features like graphics devices and physics engines.
- Component scripting written in lua. Responsible for utilising components, adding custom game scripting and overall game design.
contentvideo2: https://www.youtube.com/embed/Fwwv9GifkFM
contenttitle3: "Implicitly Parallel"
content3: 
- Hawk Engine calculates component relationships at load to produce execution order.
- Unrelated components update asynchronously without input from the designer.
- All synchrony can be turned off to simplify debugging.
contentvideo3: https://www.youtube.com/embed/Fwwv9GifkFM
contenttitle4: "Separated tooling"
content4: 
- Hawk Engine offers a generic solution for any game genre.
- Gui tooling is supported via exposed hooks.
- Manageable gamedev workflows can be created by creating targetted gui editors for your game title.
contentvideo4: https://www.youtube.com/embed/Fwwv9GifkFM
contenttitle5: "Availability"
content5: 
- Hawk Engine is currently not scheduled for release.
- If you are interested in finding more information about this tech, please visit my general enquires page.
contentvideo5: https://www.youtube.com/embed/Fwwv9GifkFM

---

# An engine focussed on distributed design and asynchronous patterns
HawkEngine is being designed along side my game project ChaosTheDevil. It is designed to offer a flexible system which can scale as a project grows. HawkEngine contains interfaces aimed at game development, however the core of the engine can be used for any micro-service style application.
