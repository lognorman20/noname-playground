export const codePlaceholder = `// Sample code
fn main(pub public_input: Field, private_input: Field) -> Bool {
    let xx = private_input + public_input;
    assert_eq(xx, 2);
    let yy = xx + 6;
    return yy == 8;
}
`;

export const privateInputPlaceholder = `{
  "private_input": "1"
}`;

export const publicInputPlaceholder = `{
  "public_input": "1"
}`;

export const basicSetupOptions = {
  history: true,
  drawSelection: true,
  foldGutter: true,
  allowMultipleSelections: true,
  bracketMatching: true,
  crosshairCursor: true,
  autocompletion: true,
};

export const EXAMPLES = {
  "arithmetic": {
    public_input: '{"public_input": "2"}',
    private_input: '{"private_input": "2"}',
    code: `fn main(pub public_input: Field, private_input: Field) {
  let xx = private_input + public_input;
  let yy = private_input * public_input;
  assert_eq(xx, yy);
} `,
  },
  "public_output": {
    public_input: '{"public_input": "1"}',
    private_input: '{"private_input": "1"}',
    code: `fn main(pub public_input: Field, private_input: Field) {
  let xx = private_input + public_input;
  assert_eq(xx, 2);
  let yy = xx + 6;
  return yy;
} `,
  },
  "lc_return": {
    public_input: '{"public_input": "1"}',
    private_input: '{"private_input": "1"}',
    code: `fn main(pub public_input: Field, private_input: Field) -> Field {
  return private_input + public_input;
} `,
  },
  "mutable": {
    public_input: "{}",
    private_input: '{"xx": "2", "yy": "3"}',
    code: `fn main(xx: Field, yy: Field) {
  assert_eq(xx, 2);

  let mut zz = xx;
  assert_eq(zz, 2);
  zz = zz + yy; // 2 + 3
  assert_eq(zz, 5);
  zz = zz + zz; // 5 + 5
  assert_eq(zz, 10);
} `,
  },
  "for_loop": {
    public_input: '{"public_input": "9"}',
    private_input: '{"private_input": ["2", "3", "4"]}',
    code: `fn main(pub public_input: Field, private_input: [Field; 3]) {
  let mut sum = 0;

  for ii in 0..3 {
    sum = sum + private_input[ii];
  }

  assert_eq(sum, public_input);
} `,
  },
  "bool": {
    public_input: '{"public_input": true}',
    private_input: '{"private_input": false}',
    code: `fn main(pub public_input: Bool, private_input: Bool) {
  // constants
  let xx = false && false;
  assert(!xx);

  // private input must be true
  let yy = private_input && true;
  assert(!yy);

  // public input must be false
  let zz = public_input && true;
  assert(zz);
} `,
  },
  "array": {
    public_input: '{"public_input": ["1", "2"]}',
    private_input: "{}",
    code: `fn main(pub public_input: [Field; 2]) {
  let xx = [1, 2, 3];

  assert_eq(public_input[0], xx[0]);
  assert_eq(public_input[1], xx[1]);

  assert_eq(1, 1);
} `,
  },
  "equals": {
    public_input: '{"xx": ["3", "3"]}',
    private_input: "{}",
    code: `fn main(pub xx: [Field; 2]) {
  let cond = xx[0] == xx[1];
  assert(cond);

  let cond2 = xx[0] == 3;
  assert(cond2);
} `,
  },
  "not_equal": {
    public_input: '{"xx": ["1", "2"]}',
    private_input: "{}",
    code: `fn main(pub xx: [Field; 2]) {
  let cond = xx[0] != xx[1];
  assert(cond);

  let cond2 = xx[0] != 7;
  assert(cond2);
} `,
  },
  "types": {
    public_input: '{"xx": "1", "yy": "2"}',
    private_input: "{}",
    code: `struct Thing {
  xx: Field,
    yy: Field,
}

fn main(pub xx: Field, pub yy: Field) {
  let thing = Thing {
    xx: 1,
    yy: 2,
  };

  assert_eq(thing.xx, xx);
  assert_eq(thing.yy, yy);
} `,
  },
  "player": {
    public_input: '{"player": "1"}',
    private_input: "{}",
    expected_public_output: '["2"]',
    code: `const player_one = 1;
const player_two = 2;

fn main(pub player: Field) -> Field {
  assert_eq(player_one, player);
  let next_player = player + 1;
  assert_eq(player_two, next_player);
  return next_player;
} `,
  },
  "functions": {
    public_input: '{"one": "1"}',
    private_input: "{}",
    code: `fn add(xx: Field, yy: Field) -> Field {
  return xx + yy;
}

fn double(xx: Field) -> Field {
  return xx + xx;
}

fn main(pub one: Field) {
  let four = add(one, 3);
  assert_eq(four, 4);

  let eight = double(4);
  assert_eq(eight, double(four));
} `,
  },
  "methods": {
    public_input: '{"xx": "1"}',
    private_input: "{}",
    code: `struct Thing {
  xx: Field,
    yy: Field,
}

fn Thing.check(self) -> Field {
  assert_eq(self.xx, 1);
  assert_eq(self.yy, 2);

  return self.xx + self.yy;
}

fn main(pub xx: Field) {
  let thing = Thing { xx: xx, yy: xx + 1
};
let res = thing.check();
assert_eq(res, 3);
}`,
  },
  "types_array": {
    public_input: '{"xx": "1", "yy": "4"}',
    private_input: "{}",
    code: `struct Thing {
  xx: Field,
    yy: Field,
}

fn main(pub xx: Field, pub yy: Field) {
  let thing1 = Thing {
    xx: 1,
    yy: 2,
  };
  let thing2 = Thing {
    xx: 3,
    yy: 4,
  };
  let things = [thing1, thing2];

  assert_eq(things[0].xx, xx);
  assert_eq(things[1].yy, yy);
} `,
  },
  "iterate": {
    public_input: '{"bedroom_holes": "2"}',
    private_input: "{}",
    expected_public_output: '["4"]',
    code: `struct Room {
  holes: Field,
}

fn Room.windows(self) -> Field {
  // a door doesn't count as a window
  return self.holes - 1;
}

struct House {
  rooms: [Room; 2],
}

fn House.room(self, const idx: Field) -> Room {
  return self.rooms[idx];
}

fn House.windows(house: House) -> Field {
  let mut windows_count = 0;
  // ideally: for room in house.rooms {
  for room_idx in 0..2 {
    let room = house.room(room_idx);
    // ideally: windows +=
    windows_count = windows_count + room.windows();
  }

  return windows_count;
}

fn main(pub bedroom_holes: Field) -> Field {
  let bedroom = Room {
    holes: bedroom_holes,
  };

  let livingroom = Room {
    holes: 4,
  };

  let house = House { rooms: [bedroom, livingroom] };

  return House.windows(house);
} `,
  },
  "assignment": {
    public_input: '{"xx": "2"}',
    private_input: "{}",
    code: `struct Thing {
  xx: Field,
}

fn try_to_mutate(thing: Thing) {
  // this should not work
  // thing.xx = 4;

  let zz = thing.xx + 3; // ideally: warning of variable unused?
}

fn main(pub xx: Field) {
  let mut thing = Thing {
    xx: xx,
  };

  // ideally: thing.xx += 1;
  thing.xx = thing.xx + 1;

  try_to_mutate(thing);

  let mut array = [xx, xx + 2, xx + 3];

  array[0] = array[0] + array[0];
  assert_eq(array[0], xx + xx);
  assert_eq(array[0], 4);
  assert_eq(array[1], 4);
  assert_eq(array[2], 5);
} `,
  },
  "if_else": {
    public_input: '{"xx": "1"}',
    private_input: "{}",
    code: `fn main(pub xx: Field) {
    let plus = xx + 1;
    let cond = xx == 1;
    let yy = if cond { plus } else { xx };
    assert_eq(yy, 2);
}`,
  },
  "literals": {
    public_input: '{"public_input": "42"}',
    private_input: "{}",
    code: `const decimal = 42;
const hex = 0x2a;

fn main(pub public_input: Field) {
    assert_eq(public_input, decimal);
    assert_eq(public_input, hex);
    assert_eq(public_input, 0x2A);
}`,
  },
  "public_output_array": {
    public_input: '{"public_input": "1"}',
    private_input: '{"private_input": "1"}',
    code: `fn main(pub public_input: Field, private_input: Field) -> [Field; 2] {
    let xx = private_input + public_input;
    assert_eq(xx, 2);
    let yy = xx + 6;
    return [yy, xx * public_input];
}`,
  },
  "types_array_output": {
    public_input: '{"xx": "1", "yy": "4"}',
    private_input: "{}",
    code: `struct Thing {
    xx: Field,
    yy: Field,
}

fn main(pub xx: Field, pub yy: Field) -> [Thing; 2] {
    let thing1 = Thing {
        xx: xx * 2,
        yy: yy,
    };
    let thing2 = Thing {
        xx: xx,
        yy: yy * 2,
    };
    let things = [thing1, thing2];

    assert_eq(things[1].xx * 2, things[0].xx);
    assert_eq(things[0].yy * 2, things[1].yy);

    return things;
}`,
  },
  "public_output_bool": {
    public_input: '{"public_input": "1"}',
    private_input: '{"private_input": "1"}',
    code: `fn main(pub public_input: Field, private_input: Field) -> Bool {
    let xx = private_input + public_input;
    assert_eq(xx, 2);
    let yy = xx + 6;
    return yy == 8;
}`,
  },
  "public_output_types": {
    public_input: '{"xx": "1", "yy": "2"}',
    private_input: "{}",
    code: `struct Thing {
    xx: Field,
    yy: Field,
}

fn main(pub xx: Field, pub yy: Field) -> Thing {
    let thing = Thing {
        xx: xx,
        yy: yy,
    };

    return thing;
}`,
  },
  "dup_var": {
    public_input: '{"public_input": "10"}',
    private_input: '{"private_input": ["1", "2", "2"]}',
    code: `fn main(pub public_input: Field, private_input: [Field; 3]) {
    let mut sum = 0;

    for ii in 0..3 {
        sum = sum + private_input[ii];
    }
    for ii in 0..3 {
        sum = sum + private_input[ii];
    }

    assert_eq(sum, public_input);
}`,
  },
};
