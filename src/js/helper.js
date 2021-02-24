export const AJAX = async function (url, errMsg) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(errMsg);

    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};
