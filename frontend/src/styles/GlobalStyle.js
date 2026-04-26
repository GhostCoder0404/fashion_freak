import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`


  *,*::before,*::after{box-sizing:border-box}
  html,body,#root{height:100%}
  body{
    margin:0;
    font-family: 'Outfit', system-ui, Arial, sans-serif;
    background: ${p => p.theme.colors.bg};
    color: ${p => p.theme.colors.text};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    -webkit-font-feature-settings: "kern";
    transition: background 0.3s ease, color 0.3s ease;
  }
  a{ color:inherit; text-decoration:none; }
  button{ font-family: inherit; }
  .container { width: min(1200px, 94%); margin: 0 auto; }
  img { max-width: 100%; }
  @media (max-width: 480px) {
    .container { width: 100%; padding: 0 16px; }
  }
`;
