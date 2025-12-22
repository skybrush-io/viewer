// Make .mp3 imports work nicely with Typescript
declare module '*.mp3' {
  const value: string;
  export default value;
}

// Make PNG imports work nicely with Typescript
declare module '*.png' {
  const value: string;
  export default value;
}

// Make .obj imports work nicely with Typescript
declare module '*.obj' {
  const value: string;
  export default value;
}
