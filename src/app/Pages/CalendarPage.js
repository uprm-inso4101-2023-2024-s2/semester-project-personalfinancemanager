import Calendar from '../Page-Functionality/Calendar';

function CalendarPage(){
    return(
        <section className='py-6 pl-6'>
            <h3 className='text-2xl text-center'>Calendar System</h3>
            <div className="flex justify-center">
                <Calendar />
            </div>
        </section>
    )
}

export default CalendarPage;