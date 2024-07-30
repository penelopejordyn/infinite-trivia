async function getData(props: string) {
  try {
    const res = await fetch(props);
    
    if (!res.ok) {
      // Log the status and statusText for more context
      console.error(`Error: ${res.status} ${res.statusText}`);
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    // Log the error message
    console.error('Fetch error:', error);
    // Re-throw the error to be handled by error boundary
    throw error;
  }
}

export default getData;
