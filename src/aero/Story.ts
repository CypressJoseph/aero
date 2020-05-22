export abstract class Story {
  context: any = {}
  timeout: number = 300
  abstract name: string;
  abstract correlatedOn: string[];
  abstract startsWith: string;
  abstract endsWith: string;

  protected get prettyContext (): string {
    return Object.entries(this.context).map(([k, v]) => `${k}: ${v}`).join(', ')
  }

  protected log (message: string) {
    const line = `[${this.name} story (${this.prettyContext})] ${message}`
    console.log(line)
  }
}
