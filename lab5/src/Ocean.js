import Plane from "./primitives/Plane";
import { VertexShader, FragmentShader } from "./shaders/Ocean";

const Ocean = new Plane(30, 30);
Ocean.scale.mul(100); // make it 100x100 units
Ocean.rotation.elements[0] = -90; // make it horizontal
Ocean.setShaders(VertexShader, FragmentShader);

export default Ocean;
