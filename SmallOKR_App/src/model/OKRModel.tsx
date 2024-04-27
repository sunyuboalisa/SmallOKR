class OKR {
  constructor() {
    this.Targets = new Set<ITarget>();
  }
  Targets: Set<ITarget>;
}

class GroupTarget {
  constructor() {
    this.Targets = [];
    this.Title = '';
  }
  Title: string;
  Targets: ITarget[];
}

export interface ITarget {
  id:number
  name: string;
  description: string;
}

class Plan {
  constructor(name: string) {
    this.Name = name;
    this.Todos = [];
  }
  Todos: Array<Todo>;
  Name: string;
}

class Todo {
  constructor(title: string) {
    this.name = title;
    this.description = '';
    this.beginDate = '';
    this.endDate = '';
    this.repeat = 1;
  }
  name: string;
  description: string;
  beginDate: string;
  endDate: string;
  repeat: number;
}

export {OKR, Plan, Todo, GroupTarget};
