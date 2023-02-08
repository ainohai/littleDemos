import { render as levelByLevelTree } from './render/p5/levelByLevelTree';
import { render as recursiveTree } from './render/p5/recursiveTree';
import { render as listRecursiveTree } from './render/p5/listRecursiveTree';
import { render as randomTree } from './render/p5/randomTree';
import { render as circlePacking } from './render/p5/circlePacking';
import { render as circlesInRow } from './render/p5/circlesInRow';


const demos: {name: string, render: () => void}[] = [
    {name: "circle packing", render: circlePacking},
    {name: "circles in row", render: circlesInRow},
    {name: "recursive tree", render: recursiveTree},
    {name: "recursive tree in list", render: listRecursiveTree},
    {name: "level by level tree", render: levelByLevelTree},
    {name: "random tree", render: randomTree},
];


const change = (event: Event) => {
document.getElementById('p5-container').innerHTML = "";
console.log(event);
const target = event.target as HTMLSelectElement;
demos[target.selectedIndex].render();
}

const createDropDown = () => {

    const select= document.createElement("select");
    
    for (let [index, demo] of demos.entries()) {
        const option = document.createElement("option");
        option.setAttribute("name", `demo-${index}`);
        option.setAttribute("id", `demo-${index}`);
        const optionText = document.createTextNode(demo.name);
        option.append(optionText);
        select.append(option);
    }

    select.value = demos[demos.length-1].name
    select.onchange = (event) => change(event);
    return select;
}

const droppari = document.getElementById("droppari");
droppari.append(createDropDown());

demos[demos.length -1].render();


