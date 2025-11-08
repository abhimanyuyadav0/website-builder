const PageBuilder = () => {
  return (
    <div className='grid grid-cols-12 gap-0 h-screen bg-slate-100'>
      {/* Sidebar: for json data and page list functionality to add sections to the page*/}
      <div className="col-span-3 h-full">
        <div className="bg-blue-500 p-2 h-full">
          <h2>Page Builder</h2>
        </div>
      </div>
      {/* Main content: for the page sections to be added to the page view of current builded page and its section
      with drag and drop functionality to add sections to the page and edit the sections and its properties
      with preview mode to preview the page and its sections and its properties
      with save and publish functionality to save the page and its sections and its properties
      with undo and redo functionality to undo and redo the page and its sections and its properties
      with delete functionality to delete the page and its sections and its properties
      with copy functionality to copy the page and its sections and its properties
      with paste functionality to paste the page and its sections and its properties
      with cut functionality to cut the page and its sections and its properties
      with paste functionality to paste the page and its sections and its properties
      with paste functionality to paste the page and its sections and its properties
      with paste functionality to paste the page and its sections and its properties
      view port show in 1470 x 956 resolution
      */}
      <div className="col-span-9 h-full">
        <div className="bg-green-500 p-2 h-full">
          <h2>Page Sections</h2>
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
