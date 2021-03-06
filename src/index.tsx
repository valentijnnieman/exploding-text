/**
 * @class ExplodingText
 */

import * as React from "react";

const Matter = require("matter-js");

const Engine = Matter.Engine,
  Composite = Matter.Composite,
  World = Matter.World,
  Bodies = Matter.Bodies;

const clamp = function(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
};

interface Vector2 {
  x: number;
  y: number;
}

interface ExplodingTextProps {
  text: Array<string>;
  lengths: Array<Array<number>>;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  debugDraw: boolean;
  boundaries: boolean;
  position: Vector2;
  onClick: () => void;
}
interface ExplodingTextState {
  text: Array<string>;
  lengths: Array<Array<number>>;
  clicked: boolean;
}

class ExplodingText extends React.PureComponent<
  ExplodingTextProps,
  ExplodingTextState
> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null;
  engine: Matter.Engine;
  borders: Array<Matter.Body>;

  static defaultProps = {
    lenghts: [],
    color: "black",
    backgroundColor: "white"
  };
  constructor(props: any) {
    super(props);
    this.state = {
      text: this.props.text,
      lengths: this.props.lengths,
      clicked: false
    };

    this.canvasRef = React.createRef();
    this.context = null;
    this.engine = Engine.create();

    let startPosition: Vector2;
    if (!this.props.position) {
      startPosition = {
        x: this.props.width / 4 + this.props.fontSize,
        y: this.props.height / 4 + this.props.fontSize
      };
    } else {
      startPosition = this.props.position;
    }

    this.props.text.forEach((s, i) => {
      for (let j = 0; j < s.length; j++) {
        const len = this.state.lengths[i]
          ? this.state.lengths[i][clamp(0, this.state.lengths[i].length - 1, j)]
          : 60;

        const newBody: Matter.Body = Bodies.rectangle(
          startPosition.x + j * len,
          // 0 + i * 100,
          0,
          len / 2,
          this.props.fontSize,
          {
            collisionFilter: {
              category: i + 1,
              mask: i + 1
            }
          }
        );
        World.add(this.engine.world, [newBody]);
      }
    });

    this.borders = [];
    // build text borders
    this.props.text.forEach((s, i) => {
      const border = Bodies.rectangle(
        startPosition.x + s.length,
        startPosition.y + i * 60,
        this.props.width,
        40,
        {
          isStatic: true,
          collisionFilter: {
            category: i + 1,
            mask: i + 1
          }
        }
      );
      World.add(this.engine.world, [border]);
      this.borders = [...this.borders, border];
    });
    Engine.run(this.engine);
  }
  renderText = () => {
    let bodies = Composite.allBodies(this.engine.world);

    if (window) {
      window.requestAnimationFrame(this.renderText);

      if (this.canvasRef.current) {
        const context = this.canvasRef.current.getContext("2d");

        if (context) {
          context.fillStyle = this.props.backgroundColor;
          context.fillRect(
            0,
            0,
            this.canvasRef.current.width,
            this.canvasRef.current.height
          );

          context.beginPath();

          let offset = 0;
          this.state.text.forEach(t => {
            const l = t.length;
            for (let i = 0; i < l; i++) {
              var vertices = bodies[offset + i].vertices;

              context.moveTo(vertices[0].x, vertices[0].y);
              context.font = `${this.props.fontSize}px Arial`;
              context.fillStyle = this.props.color;

              if (this.props.debugDraw) {
                context.strokeStyle = "magenta";
                for (var j = 1; j < vertices.length; j += 1) {
                  context.lineTo(vertices[j].x, vertices[j].y);
                }
              }

              context.fillText(
                t[i],
                bodies[offset + i].position.x - this.props.fontSize / 3.5,
                bodies[offset + i].position.y + this.props.fontSize / 3.5
              );
              // context.lineTo(vertices[0].x, vertices[0].y);
            }
            offset += l;
          });
          context.lineWidth = 1;
          context.stroke();

          this.borders.forEach(b => {
            context.beginPath();
            if (this.props.debugDraw) {
              context.strokeStyle = "magenta";
              for (var j = 1; j < b.vertices.length; j += 1) {
                context.lineTo(b.vertices[j].x, b.vertices[j].y);
              }
            }

            context.lineWidth = 1;
            context.stroke();
          });
        }
      }
    }
  };
  render() {
    if (this.props.boundaries) {
      const ground = Bodies.rectangle(
        this.props.width / 2,
        this.props.height,
        this.props.width,
        40,
        {
          isStatic: true,
          collisionFilter: {
            category: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            mask: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
          }
        }
      );
      const ceiling = Bodies.rectangle(
        this.props.width / 2,
        0,
        this.props.width,
        40,
        {
          isStatic: true,
          collisionFilter: {
            category: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            mask: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
          }
        }
      );
      const lWall = Bodies.rectangle(
        0,
        this.props.height / 2,
        40,
        this.props.height,
        {
          isStatic: true,
          collisionFilter: {
            category: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            mask: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
          }
        }
      );
      const rWall = Bodies.rectangle(
        this.props.width,
        this.props.height / 2,
        40,
        this.props.height,
        {
          isStatic: true,
          collisionFilter: {
            category: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            mask: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
          }
        }
      );
      World.add(this.engine.world, [ground, ceiling, lWall, rWall]);
    }
    this.renderText();
    return (
      <canvas
        style={{ border: this.props.debugDraw ? "1px solid magenta" : "" }}
        width={this.props.width}
        height={this.props.height}
        ref={this.canvasRef}
        onClick={() => {
          this.setState({ clicked: true });
          let bodies = Composite.allBodies(this.engine.world);
          for (var i = 0; i < bodies.length; i += 1) {
            Matter.Body.applyForce(bodies[i], bodies[i].position, {
              x: (-1.0 + Math.random() * 2) * 0.01,
              y: -Math.random() * 0.02
            });
          }
          this.borders.forEach(b => {
            World.remove(this.engine.world, b);
          });
          if (this.props.onClick) {
            this.props.onClick();
          }
        }}
      />
    );
  }
}

export default ExplodingText;
