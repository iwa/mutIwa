export default class log {
    private static getDate(): string {
        let now = new Date();

        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yyyy = now.getFullYear();
        let hh = now.getHours();
        let min = now.getMinutes();
        let ss = now.getSeconds();

        return `[${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}]`;
    }

    public static info(m: string, o?: Object) {
        console.log(`${this.getDate()} info : ${m}`);
        if (o)
            console.log(o.toString())
    }

    public static debug(m: string, o?: Object) {
        console.debug(`${this.getDate()} debug: ${m}`);
        if (o)
            console.debug(o.toString())
    }

    public static warn(m: string, o?: Object) {
        console.warn(`${this.getDate()} warn : ${m}`);
        if (o)
            console.warn(o.toString())
    }

    public static error(m: string, o?: Object) {
        console.error(`${this.getDate()} error: ${m}`);
        if (o)
            console.error(o.toString());
    }
};