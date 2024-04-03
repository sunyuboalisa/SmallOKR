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
  constructor(name: String) {
    this.Name = name;
    this.Todos = [];
  }
  Todos: Array<Todo>;
  Name: String;
}

class Todo {
  constructor(title: string) {
    this.Title = title;
    this.Description = '';
    this.StartTime = '';
    this.EndTime = '';
    this.Repeat = 1;
  }
  Title: String;
  Description: String;
  StartTime: String;
  EndTime: String;
  Repeat: number;
}

export {OKR, Plan, Todo, GroupTarget};
