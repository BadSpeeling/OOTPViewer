const fs = require('fs');

const file = 'C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 24\\online_data\\pt_card_list.csv';

fs.readFile(file, 'utf-8', (err, data) => {

    if (!err) {
        lines = data.split('\r\n');

        headers = remove_trailing_comma(lines[0]).split(',');
                
        headers = headers.map((value) => value.trim());
        headers[0] = headers[0].replace('//','')

        parsed_data = [];

        const is_num = (value) => {
            const re = /^\d+$/;
            return re.test(value);
        }
        
        for (let index = 1; index < lines.length; index++) {
            
            cur_card = remove_trailing_comma(lines[index]).split(',');
            cur_card_data = {};

            for (let card_data_index = 0; card_data_index < cur_card.length; card_data_index++) {
                
                let cur_value = cur_card[card_data_index];
                
                if (is_num(cur_value)) {
                    cur_value = parseInt(cur_value)
                }
            
                cur_card_data[headers[card_data_index]] = cur_value;
                
            }

            parsed_data.push(cur_card_data);

        }

        console.log(parsed_data[0]);

    }

})

function remove_trailing_comma (line) {
    return line.substring(0,line.length-1)
}