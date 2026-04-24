import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`


  *,*::before,*::after{box-sizing:border-box}
  html,body,#root{height:100%}
  body{
    margin:0;
    font-family: 'Outfit', system-ui, Arial, sans-serif;
    background: #fff;
    color: #0f1724;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    -webkit-font-feature-settings: "kern";
  }
  a{ color:inherit; text-decoration:none; }
  button{ font-family: inherit; }
  .container { width: min(1200px, 94%); margin: 0 auto; }
  img { max-width: 100%; }
  @media (max-width: 480px) {
    .container { width: 100%; padding: 0 16px; }
  }
`;
