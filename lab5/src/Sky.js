import Sphere from "./primitives/Sphere";
import { VertexShader, FragmentShader } from "./shaders/Sky";

const Sky = new Sphere(50, 20, 20); // radius 50, 20x20 resolution
Sky.setShaders(VertexShader, FragmentShader);

export default Sky;
