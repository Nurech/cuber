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
        .addSvgIcon('right', this.setPath(`${this.path}/icons/chevron_right_black_24dp.svg`))
        .addSvgIcon('play', this.setPath(`${this.path}/icons/play_arrow_black_24dp.svg`))
        .addSvgIcon('pause', this.setPath(`${this.path}/icons/pause_black_24dp.svg`))
        .addSvgIcon('auto_fix_high', this.setPath(`${this.path}/icons/auto_fix_high_black_24dp.svg`))
        .addSvgIcon('cast_connected', this.setPath(`${this.path}/icons/cast_connected_black_24dp.svg`))
        .addSvgIcon('cast', this.setPath(`${this.path}/icons/cast_black_24dp.svg`))
        .addSvgIcon('3d', this.setPath(`${this.path}/icons/3d_rotation_black_24dp.svg`))
        .addSvgIcon('360', this.setPath(`${this.path}/icons/360_black_24dp.svg`))
        .addSvgIcon('first', this.setPath(`${this.path}/icons/first_page_black_24dp.svg`))
        .addSvgIcon('left', this.setPath(`${this.path}/icons/chevron_left_black_24dp.svg`))
        .addSvgIcon('last', this.setPath(`${this.path}/icons/last_page_black_24dp.svg`))
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
