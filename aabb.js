const regl = require('regl')()
const canvas = document.getElementsByTagName('canvas')[0];
const camera = require('canvas-orbit-camera')(canvas)
const glslify = require('glslify');
const mat4 = require('gl-mat4');


fetch('mesh.json').then(function(response){
    var contentType=response.headers.get("content-type");
    if(contentType && contentType.includes("application/json"))
      return response.json();
    throw new TypeError("Oops, we haven't got JSON!");
}).then(function(json){ // got mesh data back from 'mesh.json'
    console.log('json',json);
    startRenderMesh(json);
    document.body.classList.remove("hidden");
}).catch(function(error){
    console.log('error',error);
});

function startRenderMesh(mesh){
  const drawMesh=regl({

    frag: glslify(`
      precision highp float;

      #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

      uniform vec4 color;
      uniform float time;

      varying vec2 posA;
      varying float height;


      void main(){
        vec2 pos2=fract(posA*100.0);
        float flatHeight=(snoise2(pos2.xy*0.05)*3.0)+(abs(snoise2(pos2.xy*0.01))*35.0)+(snoise2(pos2.xy)*0.5);
        gl_FragColor = vec4(pos2,1.0,1.0);//vec4(vec3(0.5,0.0,0.5)+vec3(flatHeight*0.02),1.0);
      }
    `),
    vert: glslify(`
      precision highp float;

      #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

      attribute vec2 position;

      uniform float time;
      uniform mat4 model,view,proj;

      varying float height;
      varying vec2 posA;


      void main(){
        posA=position;
        vec3 pos=vec3((position*2.0)-1.0,0.0);
        height=(snoise2(position.xy*0.05)*3.0)+(abs(snoise2(position.xy*0.01))*35.0)+(snoise2(position.xy)*0.5);
        gl_Position = proj * view * model * vec4(vec3(pos.x,pos.y,height), 1.0);
      }
    `),

    attributes: {
      position: mesh.positions
    },
    //elements: mesh.cells,

    uniforms: {
      color: [1, 1, 0, 1],
      time: regl.prop('time'),
      proj: ({viewportWidth, viewportHeight}) =>
       mat4.perspective([],
         Math.PI / 2,
         viewportWidth / viewportHeight,
         0.01,
         1000),
     model: mat4.identity([]),
     view: () => camera.view()
    },

    count: mesh.positions.length,
    primitive: 'triangles',

  });

  regl.frame(function({tick}) {
    regl.clear({
      color: [0, 1, 0, 1]
    });
    camera.tick();
    drawMesh({time: tick/10});
  });
}
