function UnclosableModal({show, children}){
    return (
      <div 
        style={{
          transform: show ? 'translateX(0%)' : 'translateX(-200%)',
    }}
    className='fixed top-5 left-0 w-full h-full z-10 transition-all duration-500'
    >
      <div className='container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-gray-200 py-6 px-4'>
        {children}
      </div>
    </div>
  );
}

export default UnclosableModal;