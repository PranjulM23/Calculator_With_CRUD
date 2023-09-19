import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './css/calc.css';

function Calculator() {
  const [Value, Setvalue] = useState("0");
  const [valueop, Setvalueop] = useState("0");
  const [rresult, Setresult] = useState("");
  const [text, Settext] = useState('');
  const [names, Setname] = useState("");
  const [data, setdata] = useState([]);
  const [ids, setid] = useState();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    getdata();
  },)

  const getdata = () => {
    axios.get("https://baccal.onrender.com/").then((res) => {
      setdata(res.data.user)
    })
  }
  const handledigits = (e) => {
    if (Value === "0") {
      Setvalue(e.target.value);
    } else if (e.target.value === '%') {
      Setvalue(eval(Value / 100));
    }
    else {
      Setvalue(Value + e.target.value);
    }
  }
  const handledback = (e) => {
    if (e.target.value === "DE") {
      const val = Value.slice(0, Value.length - 1);
      if (val.length > 0) {
        Setvalue(val);
      } else {
        Setvalue("0");
      }
    }
  }
  const handleop = (e) => {
    try {
      Setvalueop(Value);
      const sanitizedValue = Value.replace(/x/g, '*');
      let results = eval(sanitizedValue);
      if (!isNaN(results) && Value.includes("/")) {
        const roundedResult = results.toFixed(4);
        Setvalue(roundedResult);
        Setresult(roundedResult);
      } else {
        Setvalue(results)
        Setresult(results)
      }
    } catch (error) {
      Setvalue("Error");
      Setresult("Error")
    }
  }
  const handleSave = async () => {
    Setname(text);
    const payload = {
      name: text,
      operations: valueop,
      Result: rresult
    }
    if (!isUpdate) {

      await axios.post("https://baccal.onrender.com/", payload).then((res) => {
        console.log(res.data.user)
      }).catch((error) => {
        console.error(error);
      });
    } else {
      await axios.put(`https://baccal.onrender.com/${ids}`, payload).then((res) => {
        setIsUpdate(true);
        Settext(res.data.user.name);
      }).catch((err) => {
        console.log(err);
      })
    }
    setIsUpdate(false);

    Settext("");
  };
  const handledelete = async (id) => {
    await axios.delete(`https://baccal.onrender.com/${id}`).then((res) => {
      // console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }
  const handleedit = async (id) => {
    await axios.get(`https://baccal.onrender.com/${id}`).then((res) => {
      setIsUpdate(true);
      Settext(res.data.user.name);
      Setvalueop(res.data.user.operations);
      Setresult(res.data.user.Result);
    }).catch((err) => {
      console.log(err);
    })
    setid(id);
    // const payload = {
    //   name:text,
    //   operations:valueop,
    //   Result:rresult
    // }


  }

  return (
    <div className="box">

      <div className='container'>
        <div className="calc">

          <form action="">
            <div className="display">
              <input type="text" readOnly value={Value} />
            </div>
            <div className="inp">
              <input type="button" value="AC" className='delete' onClick={e => Setvalue("0")} />
              <input type="button" value="DE" className='high' onClick={handledback} />
              <input type="button" value="%" className='high' onClick={handledigits} />
              <input type="button" value="/" className="high" onClick={handledigits} />
            </div>
            <div className="inp">
              <input type="button" value="7" onClick={handledigits} />
              <input type="button" value="8" onClick={handledigits} />
              <input type="button" value="9" onClick={handledigits} />
              <input type="button" value="x" className="high" onClick={handledigits} />
            </div>
            <div className="inp">
              <input type="button" value="4" onClick={handledigits} />
              <input type="button" value="5" onClick={handledigits} />
              <input type="button" value="6" onClick={handledigits} />
              <input type="button" value="+" className="high" onClick={handledigits} />
            </div>
            <div className="inp">
              <input type="button" value="1" onClick={handledigits} />
              <input type="button" value="2" onClick={handledigits} />
              <input type="button" value="3" onClick={handledigits} />
              <input type="button" value="-" className="high" onClick={handledigits} />
            </div>
            <div className="inp">
              <input type="button" value="00" onClick={handledigits} />
              <input type="button" value="0" onClick={handledigits} />
              <input type="button" value="." onClick={handledigits} />
              <input type="button" value="=" className="high" onClick={handleop} />
            </div>
          </form>
        </div>

        <div className="user">
          <h4>Enter Calculations Name</h4>
          <div className="item">
            <input type="text" value={text} onChange={e => Settext(e.target.value)} />
            <button onClick={handleSave}>{isUpdate ? 'Update' : 'Save'}</button>
          </div>
        </div>

      </div>
      <div className="tables">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Operations</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.operations}</td>
                <td>{item.Result}</td>
                <td>
                  <div className="chg">
                    <button onClick={() => handleedit(item._id)}>Edit</button>
                    <button onClick={() => handledelete(item._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Calculator

// {} []