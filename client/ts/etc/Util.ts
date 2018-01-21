/**
 * Created by hen on 5/15/17.
 */
let the_unique_id_counter = 0;
export class Util {
    static simpleUId({prefix = ''}):string {
        the_unique_id_counter += 1;

        return prefix + the_unique_id_counter;
    }
}