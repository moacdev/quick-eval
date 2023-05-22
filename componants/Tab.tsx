export default function Tab({ _eval, activites, index = -1 }) {
  const getTotal = (_criteres) => {
    let sum = 0.0;
    for (const _ in _criteres)
      sum += _criteres[_] == "" ? 0 : parseFloat(_criteres[_]);
    return parseFloat(String(sum / Object.keys(_criteres).length)).toFixed(2);
  };

  const getTotalPts = (..._criteres) => {
    let superTotal = 0.0;
    for (let i = 0; i < _criteres.length; i++) {
      superTotal = parseFloat(
        String(superTotal + parseFloat(getTotal(_criteres[i])))
      );
    }

    return superTotal + 5;
  };
  return (
    <table
      cellSpacing={0}
      border={0}
      id={index != -1 ? "tabs" + index : "tab"}
      style={{ margin: "10px" }}
    >
      <colgroup
        span={3}
        style={{
          width: "89px",
        }}
      />
      <tbody>
        <tr>
          <td
            style={{
              borderTop: "2px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            height={21}
            align="left"
            valign="bottom"
          >
            ETHNIE :
          </td>
          <td
            style={{
              borderTop: "2px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            align="left"
            valign="bottom"
          >
            {_eval.name}
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={3}
            height={21}
            align="center"
            valign="bottom"
          >
            <b>PRESENTATION CUISINE</b>
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Présentation du service
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[0].name][activites[0].criteres[0].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Présentation du plat
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[0].name][activites[0].criteres[1].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Le Goût
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[0].name][activites[0].criteres[2].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={3}
            height={21}
            align="center"
            valign="bottom"
          >
            <b>DANSE TRADITIONNELLE</b>
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Originalité
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[1].name][activites[1].criteres[0].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Occupation scénique
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[1].name][activites[1].criteres[1].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Expression du corps
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[1].name][activites[1].criteres[2].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={3}
            height={21}
            align="center"
            valign="bottom"
          >
            <b>ORGANISATION DU GROUPE</b>
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Présentation du stand
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[2].name][activites[2].criteres[0].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Orignalité de la décoration
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderBottom: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[2].name][activites[2].criteres[1].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            Coordination des activités
          </td>
          <td
            style={{
              borderTop: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {_eval[activites[2].name][activites[2].criteres[2].name]}
            <br />
          </td>
        </tr>
        <tr>
          <td
            style={{
              borderTop: "2px solid #000000",
              borderBottom: "2px solid #000000",
              borderLeft: "2px solid #000000",
              borderRight: "1px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            colSpan={2}
            height={21}
            align="left"
            valign="bottom"
          >
            TOTAL POINTS
          </td>
          <td
            style={{
              borderTop: "2px solid #000000",
              borderBottom: "2px solid #000000",
              borderLeft: "1px solid #000000",
              borderRight: "2px solid #000000",
              fontFamily: "Times Roman",
              color: "#000000",
            }}
            align="left"
            valign="bottom"
          >
            {getTotalPts(
              _eval[activites[0].name],
              _eval[activites[1].name],
              _eval[activites[2].name]
            )}
            <br />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
