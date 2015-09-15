module Api
  class RecordsController < ApplicationController

  def create
    @record = Record.new(record_params)

    if @record.save
      render json: @record
    else
      render json: @record.errors.full_messages, status: 422
    end
  end

  def update
    @record = Record.find(params[:id])

    if @record.update(record_params)
      render json: @record
    else
      render json @record.errors.full_messages, status: 422
    end
  end

  def destroy
    @record = Record.find(params[:id])
    @record.destroy!

    render json: @record
  end

  def show
    @record = Record.find(params[:id])

    render json: @record
  end

  def index
    @record = Record.all

    render json: @record
  end

  private

  def record_params
    params
      .require(:record)
      .permit(
        :title,
        :label_id,
        :artist_id,
        :cat_no,
        :country,
        :year
      )
  end
end