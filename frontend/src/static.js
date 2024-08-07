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
  "new_example": {
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
  "sudoku": {
    public_input:
      '{"grid": { "inner": ["0", "5", "3", "6", "2", "1", "7", "8", "4", "0", "4", "8", "7", "5", "9", "2", "6", "3", "2", "7", "6", "8", "3", "4", "9", "5", "1", "3", "6", "9", "2", "7", "0", "4", "1", "8", "4", "8", "5", "9", "1", "6", "3", "7", "2", "0", "1", "2", "3", "4", "8", "6", "9", "5", "6", "3", "0", "1", "8", "2", "5", "4", "9", "5", "2", "1", "4", "9", "0", "8", "3", "6", "8", "9", "4", "5", "6", "3", "1", "2", "7"] }}',
    private_input:
      '{"solution": { "inner": ["9", "5", "3", "6", "2", "1", "7", "8", "4", "1", "4", "8", "7", "5", "9", "2", "6", "3", "2", "7", "6", "8", "3", "4", "9", "5", "1", "3", "6", "9", "2", "7", "5", "4", "1", "8", "4", "8", "5", "9", "1", "6", "3", "7", "2", "7", "1", "2", "3", "4", "8", "6", "9", "5", "6", "3", "7", "1", "8", "2", "5", "4", "9", "5", "2", "1", "4", "9", "7", "8", "3", "6", "8", "9", "4", "5", "6", "3", "1", "2", "7"] }}',
    code: `const empty = 0;
const player1 = 1;
const player2 = 2;
const sudoku_size = 81; // 9 * 9

struct Sudoku {
    inner: [Field; 81],
}

// return the value in a given cell
fn Sudoku.cell(self, const row: Field, const col: Field) -> Field {
    return self.inner[(row * 9) + col];
}

// verifies that self matches the grid in places where the grid has numbers
fn Sudoku.matches(self, grid: Sudoku) {
    // for each cell
    for row in 0..9 {
        for col in 0..9 {
            // either the solution matches the grid
            // or the grid is zero
            let matches = self.cell(row, col) == grid.cell(row, col);
            let is_empty = grid.cell(row, col) == empty;
            assert(matches || is_empty);
        }
    }
}

fn Sudoku.verify_rows(self) {
    for row in 0..9 {
        for num in 1..10 {
            let mut found = false;
            for col in 0..9 {
                let found_one = self.cell(row, col) == num;
                found = found || found_one;
            }
            assert(found);
        }
    }
}

fn Sudoku.verify_cols(self) {
    for col in 0..9 {
        for num in 1..10 {
            let mut found = false;
            for row in 0..9 {
                let found_one = self.cell(row, col) == num;
                found = found || found_one;
            }
            assert(found);
        }
    }
}

fn Sudoku.verify_diagonals(self) {
    for num in 1..10 {

        // first diagonal
        let mut found1 = false;
        for row1 in 0..9 {
            let temp1 = self.cell(row1, row1) == num;
            found1 = found1 || temp1;
        }
        assert(found1);

        // second diagonal
        let mut found2 = false;
        for row2 in 0..9 {
            let temp2 = self.cell(8 - row2, row2) == num;
            found2 = found2 || temp2;
        }
        assert(found2);
    }
}

fn Sudoku.verify(self) {
    self.verify_rows();
    self.verify_cols();
    self.verify_diagonals();
}

fn main(pub grid: Sudoku, solution: Sudoku) {
    solution.matches(grid);
    solution.verify();
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
