import { timed } from "./utils/timed";
import { calculateMetrics, Metrics } from "./utils/calculate-metrics";

type InputId = string;

interface Input<I> {
  id: InputId;
  input: I;
}

type OptionFunction<I> = (i: I) => void;
type OptionId = string;

interface Option<I> {
  id: OptionId;
  fn: OptionFunction<I>;
}

interface RunOptions {
  iterations: number;
  countPerIteration: number;
  warmup: number;
}

interface OptionMap<T> {
  [key: string]: T;
}

interface InputMap<T> {
  [key: string]: T;
}

export class Benchmark<I> {
  private options: Option<I>[] = [];
  private inputs: Input<I>[] = [];

  addOption(id: OptionId, fn: OptionFunction<I>): Benchmark<I> {
    this.options.push({ id, fn });
    return this;
  }

  addInput(id: InputId, input: I): Benchmark<I> {
    this.inputs.push({ id, input });
    return this;
  }

  run({ iterations, countPerIteration, warmup }: RunOptions): RunResult {
    const run = new Run(this.options, this.inputs);
    for (let i = 0; i < warmup; i++) {
      run.runIteration(countPerIteration, true);
    }
    for (let i = 0; i < iterations; i++) {
      run.runIteration(countPerIteration);
    }
    return run.computeResult();
  }
}

export class Run<I> {
  constructor(
    private readonly options: Option<I>[] = [],
    private readonly inputs: Input<I>[] = []
  ) {
    for (const option of options) {
      this.results[option.id] = {};
      for (const input of inputs) {
        this.results[option.id][input.id] = [];
      }
    }
  }
  private results: OptionMap<InputMap<number[]>> = {};

  runIteration(count: number, noresult = false) {
    for (const input of this.inputs) {
      for (const option of this.options) {
        for (let i = 0; i < count; i++) {
          const delta = timed(option.fn.bind(this, input.input));
          if (!noresult) {
            this.results[option.id][input.id].push(delta);
          }
        }
      }
    }
  }

  computeResult(): RunResult {
    const result = new RunResult();
    for (const input of this.inputs) {
      for (const option of this.options) {
        result.addResult(
          option.id,
          input.id,
          calculateMetrics(this.results[option.id][input.id])
        );
      }
    }
    return result;
  }
}

export interface RunResultEntry {
  optionId: OptionId;
  inputId: InputId;
  metrics: Metrics;
}

export class RunResult {
  private data: RunResultEntry[] = [];

  addResult(optionId: OptionId, inputId: InputId, result: Metrics) {
    this.data.push({
      optionId,
      inputId,
      metrics: result,
    });
  }

  getResultsByOptionId(optionId: OptionId): RunResultEntry[] {
    return this.data.filter((entry) => entry.optionId === optionId);
  }

  getResultsByInputId(inputId: InputId): RunResultEntry[] {
    return this.data.filter((entry) => entry.inputId === inputId);
  }

  getResults(): RunResultEntry[] {
    return this.data;
  }

  private getTableData(property: string) {
    return this.data.reduce((prev, d) => {
      if (prev[d.inputId] == null) prev[d.inputId] = {};
      prev[d.inputId][d.optionId] = d.metrics[property].toFixed(2);
      return prev;
    }, {});
  }

  print({ pretty } = { pretty: true }): void {
    if (pretty) {
      console.log("Mean in ns");
      console.table(this.getTableData("mean"));
      console.log("P99 in ns");
      console.table(this.getTableData("p99"));
      console.log("Standard Deviation in ns");
      console.table(this.getTableData("sd"));
    } else {
      console.table(
        this.data.map((d) => ({
          input: d.inputId,
          option: d.optionId,
          mean: d.metrics.mean,
        }))
      );
    }
  }
}
