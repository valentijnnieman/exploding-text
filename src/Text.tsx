import * as React from "react";
import "./App.css";
// import * as Matter from "matter-js";
const Matter = require("matter-js");
window["decomp" as any] = require("poly-decomp");

interface ExplodingTextProps {
  text: string;
  lengths?: Array<number>;
}
interface ExplodingTextState {
  text: string;
  lengths: Array<number>;
  clicked: boolean;
}

class ExplodingText extends React.PureComponent<
  ExplodingTextProps,
  ExplodingTextState
> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null;
  engine: Matter.Engine;

  constructor(props: any) {
    super(props);
    this.state = {
      text: "Valentijn Nieman",
      lengths: this.props.lengths || [],
      clicked: false
    };

    this.canvasRef = React.createRef();
    this.context = null;
    this.engine = Matter.Engine.create();
    for (let i = 0; i < this.state.text.length; i++) {
      const len = this.state.lengths ? this.state.lengths[i] : 60;
      Matter.World.add(
        this.engine.world,
        Matter.Bodies.circle(window.innerWidth / 6 + i * len, 200, 20)
      );
    }
    // window.setTimeout(() => {
    //   this.setState({ clicked: false });
    // }, 200);
  }
  renderText = () => {
    let bodies = Matter.Composite.allBodies(this.engine.world);

    window.requestAnimationFrame(this.renderText);

    const context = this.canvasRef.current?.getContext("2d");

    if (context && this.canvasRef.current) {
      context.fillStyle = "#fff";
      context.fillRect(
        0,
        0,
        this.canvasRef.current.width,
        this.canvasRef.current.height
      );

      context.beginPath();

      for (var i = 0; i < bodies.length; i += 1) {
        var vertices = bodies[i].vertices;

        context.moveTo(vertices[0].x, vertices[0].y);
        context.font = "100px Arial";
        context.fillStyle = "black";

        // for (var j = 1; j < vertices.length; j += 1) {
        //   context.lineTo(vertices[j].x, vertices[j].y);
        // }

        context.fillText(
          this.state.text[i],
          bodies[i].position.x,
          bodies[i].position.y
        );
        context.lineTo(vertices[0].x, vertices[0].y);
      }

      context.lineWidth = 1;
      context.strokeStyle = "#999";
      context.stroke();
    }
  };
  render() {
    // const that = this;
    // $.get(name).done(data => {
    //   let vertexSets: any[] = [];
    //   console.log(data);
    //   $(data)
    //     .find("path")
    //     .each((i, path) => {
    //       const points = Matter.Svg.pathToVertices(path, 30);
    //       vertexSets.push(points);
    //     });

    //   Matter.World.add(
    //     that.engine.world,
    //     Matter.Bodies.fromVertices(
    //       100,
    //       200,
    //       vertexSets,
    //       {
    //         render: {
    //           fillStyle: "black",
    //           strokeStyle: "hotpink",
    //           lineWidth: 1
    //         }
    //       },
    //       true
    //     )
    //   );
    // });
    // const boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    // const boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
    const ground = Matter.Bodies.rectangle(
      window.screen.width / 2,
      window.innerHeight,
      window.screen.width,
      40,
      {
        isStatic: true
      }
    );
    Matter.World.add(this.engine.world, [ground]);
    if (this.state.clicked) {
      Matter.Engine.run(this.engine);
    }
    // Matter.Render.run(this.renderer);
    this.renderText();
    return (
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={this.canvasRef}
        onClick={() => {
          this.setState({ clicked: true });
          let bodies = Matter.Composite.allBodies(this.engine.world);
          for (var i = 0; i < bodies.length; i += 1) {
            Matter.Body.applyForce(bodies[i], bodies[i].position, {
              x: Math.random() * 0.01,
              y: -Math.random() * 0.02
            });
          }
        }}
      />
    );
  }
}

export default ExplodingText;
