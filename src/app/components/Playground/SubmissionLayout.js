const SubmissionLayout = ({}) => {

    // TODO:
        // if course question --> show the submission page + handle logic
        // else --> show the coming soon page

    return (

        <div className="p-2 pl-4 pt-4">

            <h1 className="font-semibold text-[17px] mr-2">
                Submissions
            </h1>

            <p className="pt-2 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
                Submissions with dynamically generated tests are coming soon to the general playground...
            </p>

            <p className="pt-2 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
                Currently, this feature is implemented in the <a href="#" className="cursor-pointer text-blue-500 hover:text-blue-400">course (todo)</a>.
                {/* TODO: add link to the course */}
            </p>

        </div>

    )

}

export default SubmissionLayout;