import Projetista3DCustom, { loader } from './Projetista3DCustom';

export default function Projetista3D() {
  return <Projetista3DCustom slug="projetista-3d" />;
}

// Re-export the loader from the custom page
export { loader };

export const Component = Projetista3D;