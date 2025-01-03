class NodeType {
    data : any;
    nextNode : NodeType | null;

    constructor(data : any) {
        this.data = data;
    }

}

class LinkedList {
    head : NodeType | null;

    constructor() {
        this.head = null;
    }

    public isEmpty() : boolean {
        // 0(1)
        return this.head === null;
    }

    public size() : number {
        // 0(n)
        let current = this.head;
        let count = 0;

        while (current) {
            count++;
            current = current.nextNode
        }

        return count;
    }

    public unshift(data : any) : void {
        // 0(1)
        const newNode = new NodeType(data);
        newNode.nextNode = this.head;
        this.head = newNode;
    }

    public search(data : any) : NodeType | null {
        // 0(n)
        for (let current = this.head; current; current = current.nextNode) {
            if (current.data === data) return current;
        }
        return null;
    }

    public push(data : any) : void {
        // 0(n) 
        const newNode = new NodeType(data);
        let current = this.head;
        while (current && current.nextNode) {
            current = current.nextNode;
        }
        current!.nextNode = newNode;
    }

    public insert(data : any, index : number) : void {
        if (index < 0) {
            console.error("Can't use negative index!");
            return;
        }
        // 0(1) 
        if (index === 0) {
            this.unshift(data);
            return;
        }
        // 0(n) Find index
        const newNode = new NodeType(data);
        let current = this.head;
        for (let c = 0; c < index - 1; c++) {
            if (current && current.nextNode) {
                current = current.nextNode;
            } else {
                break;
            }
        }
        // 0(1) Insert to NodeList
        newNode.nextNode = current!.nextNode;
        current!.nextNode = newNode;
    }

    public removeByData(data : any) : void {
        // 0(1)
        if (this.head!.data === data) {
            this.head = this.head!.nextNode;
            return;
        }
        // 0(n)
        for (let current = this.head; current; current = current.nextNode) {
            if (current.nextNode?.data === data) {
                current.nextNode = current.nextNode?.nextNode!;
                break;
            };
        }                
    }

    public removeByIndex(id : number) : void {
        // 0(1)
        if (id === 0) {
            this.head = this.head!.nextNode;
            return;
        }
        // 0(n)
        let current = this.head;
        for (let c = 0; c < id; c++) {
            if (c === id - 1) {
                current!.nextNode = current!.nextNode!.nextNode;
            }
            current = current!.nextNode;
        } 
    }

    public showList() : void {
        const nodes : string[] = [];
        let current = this.head;

        while (current) {
            if (current === this.head) {
                nodes.push(`[Head: ${current.data}]`);
            } else if (!current.nextNode) {
                nodes.push(`[Tail: ${current.data}]`);
            } else {
                nodes.push(`[${current.data}]`);
            }
            current = current.nextNode;
        }

        console.log(nodes.join(" -> "));
    }

}

/* const n1 = new NodeType(1);
const l = new LinkedList();

l.head = n1;

l.unshift(50);
l.unshift(20);
l.unshift(30);
l.push(120);

l.insert(5, 2);
l.insert(8, 2);

l.removeByData(30);

l.showList(); */