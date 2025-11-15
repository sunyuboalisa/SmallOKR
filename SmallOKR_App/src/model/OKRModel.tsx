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
  id: string;
  name: string;
  description: string;
  status: number;
}

export interface IResult {
  id: string;
  targetId: string;
  name: string;
  value: string;
  creTime: Date;
}

class Plan {
  constructor(name: string) {
    this.Name = name;
    this.Todos = [];
  }
  Todos: Array<ITodo>;
  Name: string;
}

class ITodo {
  constructor(title: string) {
    this.id = '';
    this.name = title;
    this.description = '';
    this.beginDate = '';
    this.endDate = '';
    this.repeat = 1;
    this.status = 0;
  }
  id: string;
  name: string;
  description: string;
  beginDate: string;
  endDate: string;
  repeat: number;
  status: number;
}
export interface IUITodo {
  id: string;
  dateTime: string;
  title: string;
}
export { OKR, Plan, ITodo, GroupTarget };
