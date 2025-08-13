import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  subtitle?: string
}

export default ((userOpts?: Partial<Options>) => {
  const Hero: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    const siteTitle = cfg.pageTitle ?? ""
    const siteSubtitle = userOpts?.subtitle ?? cfg.pageTitleSuffix ?? ""
    const title = userOpts?.title ?? siteTitle

    return (
      <section class={classNames(displayClass, "hero")}
        style="padding: 2rem 1rem; border-radius: 12px; background: var(--highlight);">
        <h1 style="margin: 0 0 .5rem 0;">{title}</h1>
        {siteSubtitle && <p style="margin: 0; color: var(--darkgray);">{siteSubtitle}</p>}
      </section>
    )
  }

  return Hero
}) satisfies QuartzComponentConstructor
