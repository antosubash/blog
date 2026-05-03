import { AbsoluteFill, Audio, Sequence } from "remotion"
import { CodeScene } from "./scenes/CodeScene"
import { IntroScene } from "./scenes/IntroScene"
import { OutroScene } from "./scenes/OutroScene"
import { SectionScene } from "./scenes/SectionScene"
import type { RenderedStoryboard, Scene } from "./types"

const renderScene = (scene: Scene, index: number, total: number) => {
  switch (scene.type) {
    case "intro":
      return <IntroScene scene={scene} />
    case "section":
      return <SectionScene scene={scene} index={index} total={total} />
    case "code":
      return <CodeScene scene={scene} index={index} total={total} />
    case "outro":
      return <OutroScene scene={scene} />
  }
}

export const BlogVideo: React.FC<RenderedStoryboard> = ({
  scenes,
  timings,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {scenes.map((scene, index) => {
        const timing = timings[index]
        if (!timing) return null
        return (
          <Sequence
            key={scene.id}
            from={timing.startFrame}
            durationInFrames={timing.durationFrames}
            name={`${scene.type}: ${scene.id}`}
          >
            {renderScene(scene, index, scenes.length)}
            {timing.voiceFile ? <Audio src={timing.voiceFile} /> : null}
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}
