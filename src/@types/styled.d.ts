import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// Tipando o tipo do conteudo que tem escrito no tema padrão
type ThemeType = typeof defaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
