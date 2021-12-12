import { NgModule } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule({
  imports: []
})
export class IconModule {
  private path: string = 'assets';

  constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry)

  /**
   * Shortens code instead of using <img> tags, loads one icon that's re-used, gives access to icon component
   * @param domSanitizer to clean icons and mark them safe to use
   * @param matIconRegistry register icon with .addSvgIcon()
   * Usage in html:  <mat-icon [svgIcon]="'newVisit'"></mat-icon>
   * Apply style classes as you would normally, but now you also have access to underlying svg
   *
   * Style collisions can happen when in-line SVGs have same id's for classes. If you notice weird behavior on SVG
   * then change the class id on problematic SVG manually in /assets/ https://stackoverflow.com/a/38032136/15439733
   */ {
    this.matIconRegistry
        .addSvgIcon('leaderboard', this.setPath(`${this.path}/icons/leaderboard_black_24dp.svg`))
        .addSvgIcon('home', this.setPath(`${this.path}/icons/home_black_24dp.svg`))
        .addSvgIcon('tap_and_play', this.setPath(`${this.path}/icons/tap_and_play_black_24dp.svg`))
        .addSvgIcon('info', this.setPath(`${this.path}/icons/info_black_24dp.svg`))
        .addSvgIcon('videogame', this.setPath(`${this.path}/icons/videogame_asset_black_24dp.svg`))
        .addSvgIcon('live_tv', this.setPath(`${this.path}/icons/live_tv_black_24dp.svg`));
  }

  private setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
