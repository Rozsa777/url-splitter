'use strict';

/**
 * get selected tab.
 */
chrome.tabs.getSelected(null, tab => {
  splitUrl(tab.url);
});

/**
 * copy button action.
 */
document.getElementById('copy-btn').addEventListener('click', () => {
  var textArea = document.createElement("textarea");
  textArea.style.cssText = "position:absolute;left:-100%";
  document.body.appendChild(textArea);
  textArea.value = document.getElementById("query-table").innerText;
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
});

let splitUrl = value => {
  let url = getUrl(value);
  let domain = url.split('/')[2];
  document.getElementById('domain').innerText = domain;
  if (isUrl(value) || isAccessLog(value)) {
    let path = url.split('?')[0].split(domain)[1];
    let queries = url.split('?')[1];
    let html = '';
    if (queries) {
      let splittedQuery = queries.split('&');
      for (let i = 0; i < splittedQuery.length; i++) {
        let query = splittedQuery[i].split('=');
        html += getRowHtml(query[0], query[1]);
      }
    } else {
      html += getRowHtml('---', '---');
    }
    document.getElementById('path').innerText = decode(path);
    document.getElementsByTagName('tbody')[0].innerHTML = html;
  } else {
    document.getElementById('path').innerText = '---';
    document.getElementsByTagName('tbody')[0].innerHTML = getRowHtml('---', '---');
  }
};

let isUrl = value => {
  return value.substring(0, 4) === 'http';
};

let isAccessLog = value => {
  return (value.match('GET ') && value.match(' HTTP/'));
};

let getUrl = value => {
  if (isUrl(value)) {
    return value;
  } else if (isAccessLog(value)) {
    return value.split('GET ')[1].split(' HTTP/')[0];
  }
  return value;
};

let decode = value => {
  let str;
  try {
    str = decodeURIComponent(value);
  } catch(e) {
    str = value;
  }
  return str;
};

let getRowHtml = (key, value) => {
  return `<tr>
            <td class="mdl-data-table__cell--non-numeric">${decode(key)}</td>
            <td class="mdl-data-table__cell--non-numeric">${decode(value)}</td>
          </tr>`;
};
