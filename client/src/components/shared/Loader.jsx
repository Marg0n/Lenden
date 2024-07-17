
const Loader = () => {
    return (
        <div className="relative flex justify-center items-center">
            <div className=" bg-base-100 bg-opacity-60 z-10 h-[calc(100vh-142px)] w-full flex items-center justify-center">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img src="https://www.svgrepo.com/show/509009/avatar-thinking-3.svg" className="rounded-full h-28 w-28" />
            </div>
        </div>
    );
};

export default Loader;