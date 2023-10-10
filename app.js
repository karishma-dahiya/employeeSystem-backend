let mysql = require('mysql');
let express = require('express');
const { Client } = require('pg');

let app = express();

const conn = new Client({
    user: 'postgres',
    password: 'Employee@System123',
    database: 'postgres',
    port: 5432,
    host: 'db.mbelawzwvclvwgrdaqtr.supabase.co',
    ssl: { rejectUnauthorized: false },
});
conn.connect(function (res, err) {
    console.log('Connected');
});

app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

const port = 2410;

app.listen(port, () => console.log(`Server is listening on port ${port}`));


// app.get('/users', function (req, res) {
//     let query = 'SELECT * from users';
//     conn.query(query, function (err, result) {
//         if (err) res.status(500).json(err);
//         else res.json(result.rows);
//     });
// });
// app.post('/users', function (req, res) {
//     let values = Object.values(req.body);
//     let query = `INSERT INTO users (email,firstname,age) VALUES($1,$2,$3)`;
//     conn.query(query,values, function (err, result) {
//         if (err) res.status(500).json(err);
//         else res.send(`${result.rowCount} insertion successful`);
//     });
// });

app.get('/employees', function (req, res) {
    let sql = 'SELECT * from employees';
    conn.query(sql, function (err, results) {
        if (err) {
            res.status(500).json(`DataBase Error: `, err);
        } else {
            res.json(results.rows);
        }
    });
});
app.get('/employees/:id', function (req, res) {
    let id = +req.params.id;
    let sql = 'SELECT * from employees WHERE id=?';
    conn.query(sql,id, function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json(results.rows);
        }
    });

});

app.post('/employees', function (req, res) {
    
    let { empCode, name, department, designation, salary, gender } = req.body;
    let checkQuery = 'SELECT empCode FROM employees WHERE empCode =$1';
    conn.query(checkQuery, [empCode], function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else if (results.rows.length > 0) {
            res.status(400).json({ error: 'Employee already exists', message: 'An employee with this empCode already exists.' });
        } else {
            let sql = 'INSERT INTO employees (empCode,name,department,designation,salary,gender) VALUES($1,$2,$3,$4,$5,$6) ';
            let values = [empCode, name, department, designation, salary, gender];
            conn.query(sql, values, function (err1, results1) {
                if (err1) {
                    res.status(500).json({ error: 'Database Error', message: err1.message });
                } else {
                    res.json({ message: `Successfully Inserted :,`, data: results1.rows[0] });
                }
            });
        }
    }); 
});
app.put('/employees/:id', function (req, res) {
   let { empCode, name, department, designation, salary, gender } = req.body;
     let values = [empCode, name, department, designation, salary, gender];
    let id = req.params.id;
    let sql = 'UPDATE employees SET empCode=$1, name=$2, department=$3, designation=$4, salary=$5, gender=$6  WHERE empCode=$1 ';
    conn.query(sql,values, function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json({message:`Successfully Updated :,`});
        }
    });
});
app.delete('/employees/:id', function (req, res) {
    let {id} = req.params;
    let sql = 'DELETE FROM employees WHERE empCode=$1 ';
    conn.query(sql,[id], function (err, results) {
        if (err) {
            res.status(500).json({ error: 'Database Error', message: err.message });
        } else {
            res.json({message:`Successfully DELETED`});
        }
    });
});

