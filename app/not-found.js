'use client';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">

      <h1 className="text-8xl font-bold mb-4 notable text-teal-400">404</h1>
      <p className="text-3xl font-hove font-semibold mb-6">Page Not Found</p>
      <p className="font-hove  ">The page you requested could not be found.</p>
      <p className="font-hove  ">Please go back to the home page.</p>
      <button
        onClick={() => (window.location.href = '/')}
        className="mt-6 px-6 py-3 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors duration-300 font-hove font-semibold"
      >Take Me Home</button>
      <img src="/static/404/404prop.svg" alt="404 Image" className="fixed bottom-[-62px] md:bottom-0 lg:bottom-[-22px] right-[-62px] sm:right-[-22px] md:right-[-22px] lg:right-[-22px] transform scale-[0.7] sm:scale-[0.9] md:scale-[1.2] lg:scale-[0.9]"/>
    <img src="/static/404/404prop2.svg" alt="404 Image" className=" fixed top-10 right-0"/>
        <img src="/static/404/404prop4.svg" alt="404 Image" className=" fixed bottom-[72px] left-0 "/>
        <img src="/static/404/404prop3.svg" alt="404 Image" className=" fixed bottom-[150px] left-[50px]"/>



    </div>
  );
}